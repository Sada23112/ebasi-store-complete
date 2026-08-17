from rest_framework import viewsets, permissions, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Count, Avg, Q, F, Max, Min, Prefetch
from datetime import timedelta, datetime

from SHOP.models import Product, Category, Review, ProductImage, ProductVideo, AnalyticsEvent
from SHOP.serializers import get_complete_url
from accounts.models import ContactMessage
from orders.models import Wishlist
from .serializers import (
    AdminProductSerializer,
    AdminProductImageSerializer,
    AdminProductVideoSerializer,
    AdminCategorySerializer,
    AdminReviewSerializer,
    AdminContactMessageSerializer,
    AdminUserSerializer
)


class IsAdminUser(permissions.BasePermission):
    """
    Strict permission class: Allows access only to authenticated staff or superusers.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser))


class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        now = timezone.now()
        seven_days_ago = now - timedelta(days=7)
        fourteen_days_ago = now - timedelta(days=14)

        # 1. Content Counts
        total_products = Product.objects.count()
        active_products = Product.objects.filter(is_active=True).count()
        out_of_stock_products = Product.objects.filter(stock_status='out_of_stock').count()
        limited_stock_products = Product.objects.filter(stock_status='limited_stock').count()
        total_categories = Category.objects.count()
        active_categories = Category.objects.filter(is_active=True).count()
        total_reviews = Review.objects.count()
        unread_messages = ContactMessage.objects.filter(is_read=False).count()
        total_messages = ContactMessage.objects.count()

        # 2. Activity Metrics (Last 7 days vs Previous 7 days for real trend indicators)
        # Page Views
        current_page_views = AnalyticsEvent.objects.filter(
            event_type='page_view',
            created_at__gte=seven_days_ago
        ).count()
        prev_page_views = AnalyticsEvent.objects.filter(
            event_type='page_view',
            created_at__gte=fourteen_days_ago,
            created_at__lt=seven_days_ago
        ).count()

        # Product Views
        current_product_views = AnalyticsEvent.objects.filter(
            event_type='product_view',
            created_at__gte=seven_days_ago
        ).count()
        prev_product_views = AnalyticsEvent.objects.filter(
            event_type='product_view',
            created_at__gte=fourteen_days_ago,
            created_at__lt=seven_days_ago
        ).count()

        # WhatsApp Clicks (Highest Purchase Intent)
        current_whatsapp_clicks = AnalyticsEvent.objects.filter(
            event_type='whatsapp_click',
            created_at__gte=seven_days_ago
        ).count()
        prev_whatsapp_clicks = AnalyticsEvent.objects.filter(
            event_type='whatsapp_click',
            created_at__gte=fourteen_days_ago,
            created_at__lt=seven_days_ago
        ).count()

        # Wishlist Adds
        current_wishlist_adds = AnalyticsEvent.objects.filter(
            event_type='wishlist_add',
            created_at__gte=seven_days_ago
        ).count()
        prev_wishlist_adds = AnalyticsEvent.objects.filter(
            event_type='wishlist_add',
            created_at__gte=fourteen_days_ago,
            created_at__lt=seven_days_ago
        ).count()

        def calc_trend(current, prev):
            if prev > 0:
                change = round(((current - prev) / prev) * 100, 1)
                direction = 'up' if change > 0 else ('down' if change < 0 else 'neutral')
                return {'change_pct': change, 'direction': direction, 'has_comparison': True, 'previous': prev}
            elif current > 0 and prev == 0:
                return {'change_pct': 100.0, 'direction': 'up', 'has_comparison': False, 'previous': 0}
            return {'change_pct': 0.0, 'direction': 'neutral', 'has_comparison': False, 'previous': 0}

        # 3. Recent Activity Timeline
        recent_activity = []

        # Latest Contact Inquiries
        for msg in ContactMessage.objects.order_by('-created_at')[:6]:
            recent_activity.append({
                'id': f"msg_{msg.id}",
                'type': 'message',
                'title': f"Inquiry from {msg.name}",
                'subtitle': msg.subject or 'General Inquiry',
                'meta': msg.email or msg.phone,
                'created_at': msg.created_at,
                'is_read': msg.is_read
            })

        # Latest Reviews
        for rev in Review.objects.select_related('product').order_by('-created_at')[:4]:
            recent_activity.append({
                'id': f"rev_{rev.id}",
                'type': 'review',
                'title': f"{rev.rating}★ Review by {rev.user_name or 'Customer'}",
                'subtitle': f"Product: {rev.product.name}",
                'meta': rev.comment[:80] + '...' if len(rev.comment) > 80 else rev.comment,
                'created_at': rev.created_at
            })

        # Latest WhatsApp Conversions
        for wa in AnalyticsEvent.objects.filter(event_type='whatsapp_click').select_related('product').order_by('-created_at')[:4]:
            p_name = wa.product_name or (wa.product.name if wa.product else 'Direct Store Link')
            recent_activity.append({
                'id': f"wa_{wa.id}",
                'type': 'whatsapp',
                'title': f"WhatsApp Click: {p_name}",
                'subtitle': f"Source: {wa.source or 'Product Details'}",
                'meta': f"SKU: {wa.metadata.get('sku', 'N/A') if isinstance(wa.metadata, dict) else 'N/A'}",
                'created_at': wa.created_at
            })

        # Sort combined activity timeline by date descending
        recent_activity.sort(key=lambda x: x['created_at'], reverse=True)
        recent_activity = recent_activity[:10]

        # 4. Top WhatsApp Interest Products (Immediate business visibility)
        top_whatsapp_products_raw = AnalyticsEvent.objects.filter(
            event_type='whatsapp_click',
            product__isnull=False
        ).values('product__id', 'product__name', 'product__slug', 'product__price').annotate(
            whatsapp_count=Count('id')
        ).order_by('-whatsapp_count')[:5]

        return Response({
            'kpis': {
                'page_views': {
                    'total': AnalyticsEvent.objects.filter(event_type='page_view').count(),
                    'last_7_days': current_page_views,
                    'trend': calc_trend(current_page_views, prev_page_views)
                },
                'product_views': {
                    'total': AnalyticsEvent.objects.filter(event_type='product_view').count(),
                    'last_7_days': current_product_views,
                    'trend': calc_trend(current_product_views, prev_product_views)
                },
                'whatsapp_clicks': {
                    'total': AnalyticsEvent.objects.filter(event_type='whatsapp_click').count(),
                    'last_7_days': current_whatsapp_clicks,
                    'trend': calc_trend(current_whatsapp_clicks, prev_whatsapp_clicks)
                },
                'wishlist_adds': {
                    'total': Wishlist.objects.count(),
                    'last_7_days': current_wishlist_adds,
                    'trend': calc_trend(current_wishlist_adds, prev_wishlist_adds)
                }
            },
            'inventory_summary': {
                'total_products': total_products,
                'active_products': active_products,
                'out_of_stock_products': out_of_stock_products,
                'limited_stock_products': limited_stock_products,
                'total_categories': total_categories,
                'active_categories': active_categories,
                'total_reviews': total_reviews,
                'unread_messages': unread_messages,
                'total_messages': total_messages
            },
            'recent_activity': recent_activity,
            'top_whatsapp_products': list(top_whatsapp_products_raw)
        })


class AdminAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        days = int(request.query_params.get('days', 7))
        if days not in [7, 14, 30, 90, 365]:
            days = 7

        now = timezone.now()
        start_date = now - timedelta(days=days)

        # 1. Daily Aggregations (Time Series)
        daily_series = []
        for i in range(days):
            day_start = (now - timedelta(days=(days - 1 - i))).replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day_start + timedelta(days=1)
            day_label = day_start.strftime('%b %d')

            events_in_day = AnalyticsEvent.objects.filter(created_at__gte=day_start, created_at__lt=day_end)
            
            pviews = events_in_day.filter(event_type='page_view').count()
            prod_views = events_in_day.filter(event_type='product_view').count()
            wa_clicks = events_in_day.filter(event_type='whatsapp_click').count()
            wl_adds = events_in_day.filter(event_type='wishlist_add').count()

            daily_series.append({
                'date': day_start.strftime('%Y-%m-%d'),
                'label': day_label,
                'page_views': pviews,
                'product_views': prod_views,
                'whatsapp_clicks': wa_clicks,
                'wishlist_adds': wl_adds
            })

        # 2. Product Performance Breakdown (Views vs Wishlist vs WhatsApp Clicks)
        # Real aggregation per product
        all_products = Product.objects.all()
        product_performance = []

        for prod in all_products:
            p_views = AnalyticsEvent.objects.filter(product=prod, event_type='product_view', created_at__gte=start_date).count()
            total_p_views = AnalyticsEvent.objects.filter(product=prod, event_type='product_view').count()
            p_wa = AnalyticsEvent.objects.filter(product=prod, event_type='whatsapp_click', created_at__gte=start_date).count()
            total_p_wa = AnalyticsEvent.objects.filter(product=prod, event_type='whatsapp_click').count()
            p_wl = prod.wishlisted_by.count()

            # Calculate conversion intent %
            conv_pct = round((p_wa / p_views * 100), 1) if p_views > 0 else 0.0

            # Get primary image url
            primary_img = None
            try:
                imgs = list(prod.images.all())
                if imgs:
                    primary = next((img for img in imgs if img.is_primary), imgs[0])
                    primary_img = get_complete_url(primary.image, request)
            except Exception:
                pass

            product_performance.append({
                'id': prod.id,
                'name': prod.name,
                'slug': prod.slug,
                'price': float(prod.price),
                'category_name': prod.category.name if prod.category else 'Uncategorized',
                'stock_status': prod.stock_status,
                'is_active': prod.is_active,
                'primary_image': primary_img,
                'period_views': p_views,
                'total_views': total_p_views,
                'period_whatsapp_clicks': p_wa,
                'total_whatsapp_clicks': total_p_wa,
                'wishlist_count': p_wl,
                'conversion_intent_pct': conv_pct
            })

        # Sort products by period whatsapp clicks, then period views
        product_performance.sort(key=lambda x: (x['period_whatsapp_clicks'], x['period_views']), reverse=True)

        # 3. Search Behavior Analytics
        search_events = AnalyticsEvent.objects.filter(
            event_type='search',
            created_at__gte=start_date
        ).exclude(search_query='')

        top_searches_query = search_events.values('search_query').annotate(
            search_count=Count('id')
        ).order_by('-search_count')[:10]

        top_searches = [
            {'query': s['search_query'], 'count': s['search_count']}
            for s in top_searches_query
        ]

        # 4. Conversion Intent Funnel
        total_period_views = AnalyticsEvent.objects.filter(event_type='product_view', created_at__gte=start_date).count()
        total_period_wl = AnalyticsEvent.objects.filter(event_type='wishlist_add', created_at__gte=start_date).count()
        total_period_wa = AnalyticsEvent.objects.filter(event_type='whatsapp_click', created_at__gte=start_date).count()

        funnel = {
            'product_views': total_period_views,
            'wishlist_additions': total_period_wl,
            'whatsapp_inquiries': total_period_wa,
            'views_to_wa_conversion_rate': round((total_period_wa / total_period_views * 100), 2) if total_period_views > 0 else 0.0,
            'wishlist_to_wa_rate': round((total_period_wa / total_period_wl * 100), 2) if total_period_wl > 0 else 0.0
        }

        return Response({
            'timeframe_days': days,
            'daily_series': daily_series,
            'product_performance': product_performance,
            'top_searches': top_searches,
            'funnel': funnel
        })


class AdminInsightsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        """
        Derives real, high-value business insights strictly from tracked database activity.
        """
        insights = []

        # 1. Top WhatsApp High Performers
        top_wa_events = AnalyticsEvent.objects.filter(
            event_type='whatsapp_click',
            product__isnull=False
        ).values('product__id', 'product__name', 'product__slug', 'product__stock_status').annotate(
            clicks=Count('id')
        ).order_by('-clicks')[:3]

        if top_wa_events.exists() and top_wa_events[0]['clicks'] > 0:
            top_prod = top_wa_events[0]
            insights.append({
                'type': 'high_performer',
                'severity': 'success',
                'title': f"Top Purchase Intent: {top_prod['product__name']}",
                'description': f"Generated {top_prod['clicks']} direct WhatsApp inquiries. Ensure adequate stock levels to satisfy active customer interest.",
                'product_id': top_prod['product__id'],
                'product_slug': top_prod['product__slug']
            })

        # 2. High Views but Low WhatsApp Clicks (Conversion Bottleneck Opportunity)
        bottleneck_candidates = []
        for prod in Product.objects.filter(is_active=True):
            views = AnalyticsEvent.objects.filter(product=prod, event_type='product_view').count()
            wa = AnalyticsEvent.objects.filter(product=prod, event_type='whatsapp_click').count()
            if views >= 5 and wa == 0:
                bottleneck_candidates.append((prod, views))

        if bottleneck_candidates:
            bottleneck_candidates.sort(key=lambda x: x[1], reverse=True)
            top_bottleneck = bottleneck_candidates[0]
            insights.append({
                'type': 'conversion_opportunity',
                'severity': 'warning',
                'title': f"High Views, Low Inquiries: {top_bottleneck[0].name}",
                'description': f"Has received {top_bottleneck[1]} views but no WhatsApp clicks. Consider reviewing the price point, adding promotional badges, or enhancing product photos.",
                'product_id': top_bottleneck[0].id,
                'product_slug': top_bottleneck[0].slug
            })

        # 3. High Wishlist Momentum
        top_wl = Product.objects.annotate(wl_count=Count('wishlisted_by')).filter(wl_count__gt=0).order_by('-wl_count')[:1]
        if top_wl.exists():
            w_prod = top_wl[0]
            insights.append({
                'type': 'wishlist_momentum',
                'severity': 'info',
                'title': f"Customer Favorite: {w_prod.name}",
                'description': f"Saved to wishlist by {w_prod.wl_count} customers. Consider featuring this item or creating a special showcase.",
                'product_id': w_prod.id,
                'product_slug': w_prod.slug
            })

        # 4. Out of Stock Alert
        out_of_stock = Product.objects.filter(stock_status='out_of_stock', is_active=True).count()
        if out_of_stock > 0:
            insights.append({
                'type': 'inventory_alert',
                'severity': 'alert',
                'title': f"{out_of_stock} Active Products Out of Stock",
                'description': "Some active products are currently marked out of stock. Update availability or restock to avoid missed customer inquiries.",
                'product_id': None,
                'product_slug': None
            })

        # 5. Unread Messages Alert
        unread_count = ContactMessage.objects.filter(is_read=False).count()
        if unread_count > 0:
            insights.append({
                'type': 'messages_alert',
                'severity': 'alert',
                'title': f"{unread_count} Unread Customer Messages",
                'description': "You have new inquiries waiting in the Contact Inbox. Fast replies increase customer conversion.",
                'product_id': None,
                'product_slug': None
            })

        return Response({'insights': insights})


class AdminProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = AdminProductSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'sku', 'description', 'short_description', 'category__name']
    ordering_fields = ['created_at', 'price', 'name', 'stock_quantity', 'stock_status']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Product.objects.all().select_related('category').prefetch_related(
            Prefetch('images', queryset=ProductImage.objects.order_by('-is_primary', 'order')),
            'videos',
            'reviews',
            'wishlisted_by'
        ).annotate(
            annotated_review_count=Count('reviews', distinct=True),
            annotated_avg_rating=Avg('reviews__rating')
        )

        category_id = self.request.query_params.get('category', None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        stock_status = self.request.query_params.get('stock_status', None)
        if stock_status:
            queryset = queryset.filter(stock_status=stock_status)

        badge = self.request.query_params.get('badge', None)
        if badge:
            queryset = queryset.filter(badge=badge)

        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None and is_active != '':
            queryset = queryset.filter(is_active=(is_active.lower() == 'true'))

        is_featured = self.request.query_params.get('is_featured', None)
        if is_featured is not None and is_featured != '':
            queryset = queryset.filter(is_featured=(is_featured.lower() == 'true'))

        return queryset

    @action(detail=True, methods=['patch'], url_path='toggle-active')
    def toggle_active(self, request, pk=None):
        product = self.get_object()
        product.is_active = not product.is_active
        product.save(update_fields=['is_active'])
        return Response({'status': 'success', 'is_active': product.is_active})

    @action(detail=True, methods=['patch'], url_path='toggle-featured')
    def toggle_featured(self, request, pk=None):
        product = self.get_object()
        product.is_featured = not product.is_featured
        product.save(update_fields=['is_featured'])
        return Response({'status': 'success', 'is_featured': product.is_featured})

    @action(detail=True, methods=['post'], url_path='upload-image', parser_classes=[MultiPartParser, FormParser])
    def upload_image(self, request, pk=None):
        product = self.get_object()
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)

        alt_text = request.data.get('alt_text', product.name)
        is_primary = request.data.get('is_primary', 'false').lower() == 'true'
        try:
            order = int(request.data.get('order', 0))
        except (ValueError, TypeError):
            order = 0

        if is_primary:
            ProductImage.objects.filter(product=product).update(is_primary=False)
        elif not ProductImage.objects.filter(product=product, is_primary=True).exists():
            is_primary = True

        img = ProductImage.objects.create(
            product=product,
            image=image_file,
            alt_text=alt_text,
            is_primary=is_primary,
            order=order
        )

        serializer = AdminProductImageSerializer(img, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path='delete-image/(?P<image_id>[^/.]+)')
    def delete_image(self, request, pk=None, image_id=None):
        product = self.get_object()
        try:
            img = ProductImage.objects.get(id=image_id, product=product)
            was_primary = img.is_primary
            img.delete()

            # If deleted image was primary, make the first remaining image primary
            if was_primary:
                first_img = ProductImage.objects.filter(product=product).first()
                if first_img:
                    first_img.is_primary = True
                    first_img.save(update_fields=['is_primary'])

            return Response({'status': 'success', 'message': 'Image deleted successfully'})
        except ProductImage.DoesNotExist:
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['patch'], url_path='set-primary-image/(?P<image_id>[^/.]+)')
    def set_primary_image(self, request, pk=None, image_id=None):
        product = self.get_object()
        try:
            target_img = ProductImage.objects.get(id=image_id, product=product)
            ProductImage.objects.filter(product=product).update(is_primary=False)
            target_img.is_primary = True
            target_img.save(update_fields=['is_primary'])
            return Response({'status': 'success', 'primary_image_id': target_img.id})
        except ProductImage.DoesNotExist:
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)


class AdminCategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = AdminCategorySerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'slug', 'description']
    ordering_fields = ['name', 'created_at', 'products_count']
    ordering = ['name']

    def get_queryset(self):
        return Category.objects.annotate(
            products_count=Count('products', distinct=True),
            active_products_count=Count('products', filter=Q(products__is_active=True), distinct=True)
        )

    @action(detail=True, methods=['patch'], url_path='toggle-active')
    def toggle_active(self, request, pk=None):
        category = self.get_object()
        category.is_active = not category.is_active
        category.save(update_fields=['is_active'])
        return Response({'status': 'success', 'is_active': category.is_active})

    def destroy(self, request, *args, **kwargs):
        category = self.get_object()
        linked_products_count = category.products.count()
        if linked_products_count > 0:
            return Response({
                'error': f"Cannot delete category '{category.name}' because it contains {linked_products_count} product(s). Please reassign or delete these products first."
            }, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)


class AdminReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = AdminReviewSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['product__name', 'user_name', 'comment']
    ordering_fields = ['created_at', 'rating']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Review.objects.select_related('product').all()
        rating = self.request.query_params.get('rating', None)
        if rating:
            queryset = queryset.filter(rating=rating)
        product_id = self.request.query_params.get('product', None)
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset


class AdminContactMessageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = AdminContactMessageSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'email', 'phone', 'subject', 'message']
    ordering_fields = ['created_at', 'is_read', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = ContactMessage.objects.all()
        is_read = self.request.query_params.get('is_read', None)
        if is_read is not None and is_read != '':
            queryset = queryset.filter(is_read=(is_read.lower() == 'true'))
        return queryset

    @action(detail=True, methods=['patch'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        message = self.get_object()
        message.is_read = True
        message.save(update_fields=['is_read'])
        return Response({'status': 'success', 'is_read': True})

    @action(detail=True, methods=['patch'], url_path='mark-unread')
    def mark_unread(self, request, pk=None):
        message = self.get_object()
        message.is_read = False
        message.save(update_fields=['is_read'])
        return Response({'status': 'success', 'is_read': False})


class AdminUserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = AdminUserSerializer
    queryset = User.objects.all().order_by('-date_joined')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'username']

    @action(detail=True, methods=['patch'], url_path='toggle-status')
    def toggle_status(self, request, pk=None):
        user = self.get_object()
        # Protect against self-deactivation
        if user == request.user:
            return Response({'error': 'You cannot deactivate your own account.'}, status=status.HTTP_400_BAD_REQUEST)
        user.is_active = not user.is_active
        user.save(update_fields=['is_active'])
        return Response({'status': 'success', 'is_active': user.is_active})
