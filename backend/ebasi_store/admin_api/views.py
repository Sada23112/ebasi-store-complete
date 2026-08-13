from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from SHOP.models import Product, Category, Review
from accounts.models import ContactMessage
from SHOP.serializers import ProductDetailSerializer, ProductListSerializer
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
        total_products = Product.objects.count()
        active_products = Product.objects.filter(is_active=True).count()
        total_categories = Category.objects.count()
        total_users = User.objects.count()
        unread_messages = ContactMessage.objects.filter(is_read=False).count()

        recent_messages = ContactMessage.objects.order_by('-created_at')[:5]
        recent_activity = []
        for msg in recent_messages:
            recent_activity.append({
                'type': 'contact',
                'message': f"Message from {msg.name}: {msg.subject}",
                'time': msg.created_at,
                'user': msg.email
            })
        
        return Response({
            'total_products': total_products,
            'active_products': active_products,
            'total_categories': total_categories,
            'total_users': total_users,
            'unread_messages': unread_messages,
            'recent_activity': recent_activity
        })

class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def perform_create(self, serializer):
        serializer.save()

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

