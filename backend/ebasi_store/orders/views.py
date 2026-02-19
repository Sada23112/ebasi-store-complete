from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Order, OrderItem
from .serializers import CartSerializer, OrderSerializer, CartItemSerializer
from SHOP.models import Product

class CartViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def create(self, request): # Add item to cart
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        product = get_object_or_404(Product, id=product_id)
        
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
            
        cart_item.save()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def destroy(self, request):
        """Clear entire cart"""
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart.items.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CartItemViewSet(viewsets.ViewSet):
    """Manage individual cart items by product ID"""
    permission_classes = [permissions.IsAuthenticated]

    def destroy(self, request, product_id=None):
        """Remove a specific item from cart by product ID"""
        cart = Cart.objects.filter(user=request.user).first()
        if not cart:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
        
        cart_item = CartItem.objects.filter(cart=cart, product_id=product_id).first()
        if not cart_item:
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
        
        cart_item.delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def partial_update(self, request, product_id=None):
        """Update quantity of a specific cart item by product ID"""
        cart = Cart.objects.filter(user=request.user).first()
        if not cart:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
        
        cart_item = CartItem.objects.filter(cart=cart, product_id=product_id).first()
        if not cart_item:
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
        
        quantity = int(request.data.get('quantity', 1))
        if quantity <= 0:
            cart_item.delete()
        else:
            cart_item.quantity = quantity
            cart_item.save()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        cart = get_object_or_404(Cart, user=self.request.user)
        total_amount = sum(item.total_price for item in cart.items.all())
        
        order = serializer.save(user=self.request.user, total_amount=total_amount)
        
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                price=item.product.price,
                quantity=item.quantity
            )
        
        cart.items.all().delete() # Clear cart after order

from .models import Wishlist
from .serializers import WishlistSerializer

class WishlistViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WishlistSerializer

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """Toggle product in wishlist (add/remove)"""
        product_id = request.data.get('product_id')
        product = get_object_or_404(Product, id=product_id)
        
        wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, product=product)
        
        if not created:
            wishlist_item.delete()
            return Response({'status': 'removed', 'product_id': product_id}, status=status.HTTP_200_OK)
        
        return Response({'status': 'added', 'product_id': product_id}, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None):
        """Remove item from wishlist by product ID"""
        # We override destroy to allow deleting by product_id if passed as pk, 
        # or we can rely on standard ID. Let's support product_id for easier frontend logic
        try:
            wishlist_item = Wishlist.objects.get(user=request.user, product_id=pk)
            wishlist_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Wishlist.DoesNotExist:
             # Try standard ID
            return super().destroy(request, pk)
