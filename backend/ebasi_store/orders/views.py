from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from SHOP.models import Product
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
        try:
            wishlist_item = Wishlist.objects.get(user=request.user, product_id=pk)
            wishlist_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Wishlist.DoesNotExist:
            return super().destroy(request, pk)

