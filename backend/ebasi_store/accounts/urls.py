from django.urls import path
from .views import UserDetailView, AdminLoginView, ContactMessageView

urlpatterns = [
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('contact/', ContactMessageView.as_view(), name='contact'),
    path('profile/', UserDetailView.as_view(), name='profile'),
]

