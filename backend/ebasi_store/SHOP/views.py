from rest_framework import generics, filters, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category, Product, Review, ProductImage
from .serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer, ReviewSerializer
from django.db.models import Q, Count, Avg, Prefetch
from accounts.views import SensitiveAnonThrottle, SensitiveUserThrottle


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'short_description', 'sku']
    ordering_fields = ['price', 'created_at', 'name', 'annotated_avg_rating']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).select_related('category').annotate(
            annotated_review_count=Count('reviews', distinct=True),
            annotated_avg_rating=Avg('reviews__rating')
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

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Calculate min and max price of all active products
        from django.db.models import Max, Min
        active_products = Product.objects.filter(is_active=True)
        price_stats = active_products.aggregate(
            min_price=Min('price'),
            max_price=Max('price')
        )
        min_price = price_stats['min_price'] or 0
        max_price = price_stats['max_price'] or 100000

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
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'


class FeaturedProductsView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True, is_featured=True).order_by('-created_at')
    serializer_class = ProductListSerializer


class CategoryProductsView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        return Product.objects.filter(
            is_active=True,
            category__slug=category_slug,
            category__is_active=True
        )


class ReviewListCreateView(generics.ListCreateAPIView):
    """
    GET: List all reviews for a product (public).
    POST: Create a new review for a product (public — no login required).
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [SensitiveAnonThrottle, SensitiveUserThrottle]

    def get_queryset(self):
        slug = self.kwargs['slug']
        return Review.objects.filter(product__slug=slug)

    def perform_create(self, serializer):
        slug = self.kwargs['slug']
        product = Product.objects.get(slug=slug, is_active=True)
        serializer.save(product=product)
