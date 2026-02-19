from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Sum, Count
from datetime import timedelta

from SHOP.models import Product, Category, ProductImage
from orders.models import Order
from accounts.models import ContactMessage
from SHOP.serializers import ProductDetailSerializer, ProductListSerializer
from orders.serializers import OrderSerializer
from accounts.serializers import UserSerializer, ContactMessageSerializer

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get(self, request):
        # Key Metrics
        total_revenue = Order.objects.filter(status='delivered').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_orders = Order.objects.count()
        total_users = User.objects.count()
        
        # Calculate conversion rate (orders / users * 100) - simplified
        conversion_rate = 0
        if total_users > 0:
            conversion_rate = (total_orders / total_users) * 100

        # Recent Activity (Last 5 orders)
        recent_orders = Order.objects.order_by('-created_at')[:5]
        recent_activity = []
        for order in recent_orders:
            recent_activity.append({
                'type': 'order',
                'message': f"New order #{order.id} received",
                'time': order.created_at,
                'user': order.user.username
            })
            
        # Sales Data (Mock for now, or aggregate by month if enough data)
        # For simplicity, we'll return some real aggregates if possible, else structured data
        
        return Response({
            'total_revenue': total_revenue,
            'total_orders': total_orders,
            'total_users': total_users,
            'conversion_rate': round(conversion_rate, 2),
            'recent_activity': recent_activity
        })

class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def perform_create(self, serializer):
        # Handle category assignment by ID if needed, or slug
        # For now, standard save
        serializer.save()

class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        status = request.data.get('status')
        if status:
            order.status = status
            order.save()
            return Response({'status': 'success', 'new_status': order.status})
        return Response({'status': 'error', 'message': 'Status not provided'}, status=400)

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    @action(detail=True, methods=['patch'])
    def toggle_status(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        return Response({'status': 'success', 'is_active': user.is_active})

class AdminContactMessageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    @action(detail=True, methods=['patch'])
    def mark_read(self, request, pk=None):
        message = self.get_object()
        message.is_read = True
        message.save()
        return Response({'status': 'success', 'is_read': True})
