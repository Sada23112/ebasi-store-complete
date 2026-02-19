from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, CustomAuthToken, UserDetailView, AddressViewSet, AdminLoginView, ContactMessageView, GoogleLogin

router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomAuthToken.as_view(), name='login'),
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('contact/', ContactMessageView.as_view(), name='contact'),
    path('profile/', UserDetailView.as_view(), name='profile'),
    path('google/', GoogleLogin.as_view(), name='google_login'),
    path('', include(router.urls)),
]
