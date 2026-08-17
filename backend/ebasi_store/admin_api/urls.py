from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminDashboardView,
    AdminAnalyticsView,
    AdminInsightsView,
    AdminProductViewSet,
    AdminCategoryViewSet,
    AdminReviewViewSet,
    AdminContactMessageViewSet,
    AdminUserViewSet
)

app_name = 'admin_api'

router = DefaultRouter()
router.register(r'products', AdminProductViewSet, basename='admin-products')
router.register(r'categories', AdminCategoryViewSet, basename='admin-categories')
router.register(r'reviews', AdminReviewViewSet, basename='admin-reviews')
router.register(r'contacts', AdminContactMessageViewSet, basename='admin-contacts')
router.register(r'users', AdminUserViewSet, basename='admin-users')

urlpatterns = [
    path('dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    path('insights/', AdminInsightsView.as_view(), name='admin-insights'),
    path('', include(router.urls)),
]
