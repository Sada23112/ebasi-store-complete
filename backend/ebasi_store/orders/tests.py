from django.test import TestCase
from django.contrib.auth.models import User
from django.db import IntegrityError
from rest_framework.test import APIClient
from rest_framework import status
from SHOP.models import Category, Product
from orders.models import Wishlist


class WishlistModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password123")
        self.category = Category.objects.create(name="Traditional", slug="traditional")
        self.product = Product.objects.create(
            name="Handwoven Mekhela",
            slug="handwoven-mekhela",
            sku="SKU-WISH-1",
            price=3200,
            category=self.category
        )

    def test_str_representation(self):
        wishlist_item = Wishlist.objects.create(user=self.user, product=self.product)
        self.assertEqual(str(wishlist_item), f"{self.user.username} - {self.product.name}")

    def test_unique_together_constraint(self):
        Wishlist.objects.create(user=self.user, product=self.product)
        with self.assertRaises(IntegrityError):
            Wishlist.objects.create(user=self.user, product=self.product)


class WishlistViewSetTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username="user1", password="password123")
        self.user2 = User.objects.create_user(username="user2", password="password123")
        self.category = Category.objects.create(name="Silk Sarees", slug="silk-sarees")
        self.product1 = Product.objects.create(
            name="Assam Silk Saree 1",
            slug="assam-silk-saree-1",
            sku="SKU-SILK-1",
            price=4500,
            category=self.category
        )
        self.product2 = Product.objects.create(
            name="Assam Silk Saree 2",
            slug="assam-silk-saree-2",
            sku="SKU-SILK-2",
            price=5500,
            category=self.category
        )

    def test_unauthenticated_access_denied(self):
        res = self.client.get('/api/v1/orders/wishlist/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        res_toggle = self.client.post('/api/v1/orders/wishlist/toggle/', {'product_id': self.product1.id})
        self.assertEqual(res_toggle.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_wishlist_isolation(self):
        Wishlist.objects.create(user=self.user1, product=self.product1)
        Wishlist.objects.create(user=self.user2, product=self.product2)

        self.client.force_authenticate(user=self.user1)
        res = self.client.get('/api/v1/orders/wishlist/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data.get('results', res.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['product']['id'], self.product1.id)

    def test_toggle_wishlist_add_and_remove(self):
        self.client.force_authenticate(user=self.user1)

        # First toggle: should add
        res_add = self.client.post(
            '/api/v1/orders/wishlist/toggle/',
            {'product_id': self.product1.id},
            format='json'
        )
        self.assertEqual(res_add.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res_add.data.get('status'), 'added')
        self.assertTrue(Wishlist.objects.filter(user=self.user1, product=self.product1).exists())

        # Second toggle: should remove
        res_remove = self.client.post(
            '/api/v1/orders/wishlist/toggle/',
            {'product_id': self.product1.id},
            format='json'
        )
        self.assertEqual(res_remove.status_code, status.HTTP_200_OK)
        self.assertEqual(res_remove.data.get('status'), 'removed')
        self.assertFalse(Wishlist.objects.filter(user=self.user1, product=self.product1).exists())

    def test_toggle_nonexistent_product_returns_404(self):
        self.client.force_authenticate(user=self.user1)
        res = self.client.post(
            '/api/v1/orders/wishlist/toggle/',
            {'product_id': 999999},
            format='json'
        )
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_destroy_wishlist_item_by_product_id(self):
        self.client.force_authenticate(user=self.user1)
        Wishlist.objects.create(user=self.user1, product=self.product1)

        res = self.client.delete(f'/api/v1/orders/wishlist/{self.product1.id}/')
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Wishlist.objects.filter(user=self.user1, product=self.product1).exists())

    def test_destroy_nonexistent_item_returns_404(self):
        self.client.force_authenticate(user=self.user1)
        res = self.client.delete('/api/v1/orders/wishlist/999999/')
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_toggle_missing_product_id_returns_404(self):
        self.client.force_authenticate(user=self.user1)
        res = self.client.post(
            '/api/v1/orders/wishlist/toggle/',
            {},
            format='json'
        )
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

