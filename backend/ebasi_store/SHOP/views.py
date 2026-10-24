from rest_framework import generics, filters, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from .models import Category, Product, Review, ProductImage, AnalyticsEvent, PRODUCT_PRICE_CACHE_KEY
from .pagination import StandardResultsSetPagination
from .serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer, ReviewSerializer, AnalyticsEventSerializer
from django.db.models import Q, Count, Avg, Prefetch
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from accounts.views import SensitiveAnonThrottle, SensitiveUserThrottle

MAX_ANALYTICS_BATCH_SIZE = 25


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'short_description', 'sku']
    ordering_fields = ['price', 'created_at', 'name', 'annotated_avg_rating']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).select_related('category').annotate(
            annotated_review_count=Count('reviews', filter=Q(reviews__is_approved=True), distinct=True),
            annotated_avg_rating=Avg('reviews__rating', filter=Q(reviews__is_approved=True))
        ).prefetch_related(
            Prefetch('images', queryset=ProductImage.objects.order_by('-is_primary', 'order'))
        )

        # Custom filtering for category, price range, etc.
        category_slug = self.request.query_params.get('category', None)
        if category_slug:
             queryset = queryset.filter(category__slug=category_slug)

        min_price = self.request.query_params.get('min_price', None)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        max_price = self.request.query_params.get('max_price', None)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        badge = self.request.query_params.get('badge', None)
        if badge:
            queryset = queryset.filter(badge=badge)

        in_stock = self.request.query_params.get('in_stock', None)
        if in_stock == 'true':
            queryset = queryset.filter(stock_status='in_stock')

        on_sale = self.request.query_params.get('on_sale', None)
        if on_sale == 'true':
            from django.db.models import F
            queryset = queryset.filter(compare_price__gt=F('price'))

        is_featured = self.request.query_params.get('is_featured', None)
        if is_featured == 'true':
            queryset = queryset.filter(is_featured=True)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Get cached min and max price of all active products
        def _compute_price_stats():
            from django.db.models import Max, Min
            stats = Product.objects.filter(is_active=True).aggregate(
                min_price=Min('price'),
                max_price=Max('price')
            )
            min_val = stats['min_price']
            max_val = stats['max_price']
            return {
                'min_price': float(min_val) if min_val is not None else 0.0,
                'max_price': float(max_val) if max_val is not None else 100000.0
            }

        price_stats = cache.get_or_set(PRODUCT_PRICE_CACHE_KEY, _compute_price_stats, timeout=300)
        if not isinstance(price_stats, dict):
            price_stats = _compute_price_stats()

        min_price = price_stats.get('min_price', 0.0)
        max_price = price_stats.get('max_price', 100000.0)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
            response.data['min_price'] = float(min_price)
            response.data['max_price'] = float(max_price)
            return response

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'results': serializer.data,
            'min_price': float(min_price),
            'max_price': float(max_price)
        })


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related('category').annotate(
            annotated_review_count=Count('reviews', filter=Q(reviews__is_approved=True), distinct=True),
            annotated_avg_rating=Avg('reviews__rating', filter=Q(reviews__is_approved=True))
        ).prefetch_related(
            Prefetch('images', queryset=ProductImage.objects.order_by('-is_primary', 'order')),
            'videos',
            Prefetch('reviews', queryset=Review.objects.filter(is_approved=True))
        )


class FeaturedProductsView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        return Product.objects.filter(is_active=True, is_featured=True).select_related('category').annotate(
            annotated_review_count=Count('reviews', filter=Q(reviews__is_approved=True), distinct=True),
            annotated_avg_rating=Avg('reviews__rating', filter=Q(reviews__is_approved=True))
        ).prefetch_related(
            Prefetch('images', queryset=ProductImage.objects.order_by('-is_primary', 'order'))
        ).order_by('-created_at')


class CategoryProductsView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        return Product.objects.filter(
            is_active=True,
            category__slug=category_slug,
            category__is_active=True
        ).select_related('category').annotate(
            annotated_review_count=Count('reviews', filter=Q(reviews__is_approved=True), distinct=True),
            annotated_avg_rating=Avg('reviews__rating', filter=Q(reviews__is_approved=True))
        ).prefetch_related(
            Prefetch('images', queryset=ProductImage.objects.order_by('-is_primary', 'order'))
        ).order_by('-created_at')


class ReviewListCreateView(generics.ListCreateAPIView):
    """
    GET: List all approved reviews for a product (public).
    POST: Create a new review for a product (public — defaults to is_approved=False).
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [SensitiveAnonThrottle, SensitiveUserThrottle]

    def get_queryset(self):
        slug = self.kwargs['slug']
        return Review.objects.filter(product__slug=slug, is_approved=True)

    def perform_create(self, serializer):
        slug = self.kwargs['slug']
        product = get_object_or_404(Product, slug=slug, is_active=True)
        serializer.save(product=product, is_approved=False)


class TrackAnalyticsEventView(generics.CreateAPIView):
    """
    Records customer-behavior analytics events (page_view, product_view, search,
    wishlist_add, whatsapp_click, contact_submit) for store insights in Django Admin.
    Enforces batch limits (max 25 events per request) and throttling.
    """
    queryset = AnalyticsEvent.objects.all()
    serializer_class = AnalyticsEventSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle, UserRateThrottle]

    def create(self, request, *args, **kwargs):
        data = request.data
        if isinstance(data, list):
            if len(data) > MAX_ANALYTICS_BATCH_SIZE:
                return Response(
                    {'error': f'Batch size exceeds maximum allowed limit of {MAX_ANALYTICS_BATCH_SIZE} events.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not data:
                return Response(
                    {'status': 'recorded', 'count': 0},
                    status=status.HTTP_200_OK
                )
            serializer = self.get_serializer(data=data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(
                {'status': 'recorded', 'count': len(serializer.data)},
                status=status.HTTP_201_CREATED
            )
        return super().create(request, *args, **kwargs)
