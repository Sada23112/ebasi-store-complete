from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminDashboardView,
    AdminAnalyticsView,
    AdminInsightsView,
    AdminMeView,
    AdminProductViewSet,
    AdminCategoryViewSet,
    AdminReviewViewSet,
    AdminContactMessageViewSet,
    AdminStaffViewSet,
    AdminAuditLogViewSet
)
from cms.views import (
    AdminStoreProfileView,
    AdminSocialLinkViewSet,
    AdminHeroSectionView,
    AdminPageContentViewSet,
    AdminMediaAssetViewSet
)

app_name = 'admin_api'

router = DefaultRouter()
router.register(r'products', AdminProductViewSet, basename='admin-products')
router.register(r'categories', AdminCategoryViewSet, basename='admin-categories')
router.register(r'reviews', AdminReviewViewSet, basename='admin-reviews')
router.register(r'contacts', AdminContactMessageViewSet, basename='admin-contacts')
router.register(r'staff', AdminStaffViewSet, basename='admin-staff')
router.register(r'users', AdminStaffViewSet, basename='admin-users')  # Compatibility alias
router.register(r'audit-logs', AdminAuditLogViewSet, basename='admin-audit-logs')
router.register(r'cms/social-links', AdminSocialLinkViewSet, basename='admin-cms-social-links')
router.register(r'cms/pages', AdminPageContentViewSet, basename='admin-cms-pages')
router.register(r'cms/media', AdminMediaAssetViewSet, basename='admin-cms-media')

urlpatterns = [
    path('me/', AdminMeView.as_view(), name='admin-me'),
    path('dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    path('insights/', AdminInsightsView.as_view(), name='admin-insights'),
    path('cms/store/', AdminStoreProfileView.as_view(), name='admin-cms-store'),
    path('cms/hero/', AdminHeroSectionView.as_view(), name='admin-cms-hero'),
    path('', include(router.urls)),
]
