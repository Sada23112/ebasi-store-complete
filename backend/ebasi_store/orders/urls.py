from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartViewSet, CartItemViewSet, OrderViewSet, WishlistViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('cart/', CartViewSet.as_view({'get': 'list', 'post': 'create', 'delete': 'destroy'}), name='cart'),
    path('cart/item/<int:product_id>/', CartItemViewSet.as_view({'delete': 'destroy', 'patch': 'partial_update'}), name='cart-item'),
    path('checkout/', OrderViewSet.as_view({'post': 'create'}), name='checkout'),
    path('', include(router.urls)),
]
