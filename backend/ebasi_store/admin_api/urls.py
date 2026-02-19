from django.urls import path, include
from . import views

app_name = 'admin_api'

from rest_framework.routers import DefaultRouter
from .views import (
    AdminDashboardView, 
    AdminProductViewSet, 
    AdminOrderViewSet, 
    AdminUserViewSet,
    AdminContactMessageViewSet
)

router = DefaultRouter()
router.register(r'products', AdminProductViewSet, basename='admin-products')
router.register(r'orders', AdminOrderViewSet, basename='admin-orders')
router.register(r'users', AdminUserViewSet, basename='admin-users')
router.register(r'contacts', AdminContactMessageViewSet, basename='admin-contacts')

urlpatterns = [
    path('dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('', include(router.urls)),
]
