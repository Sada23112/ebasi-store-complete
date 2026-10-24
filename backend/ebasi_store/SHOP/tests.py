from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from SHOP.models import AnalyticsEvent, Product, Category


class TrackAnalyticsEventViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name="Traditional Attire", slug="traditional-attire")
        self.product = Product.objects.create(
            name="Mekhela Sador",
            slug="mekhela-sador",
            price=2500,
            category=self.category
        )
        self.track_url = "/api/v1/analytics/track/"

    def test_single_event_recorded(self):
        payload = {
            "event_type": "page_view",
            "path": "/shop",
            "session_id": "test_session_1"
        }
        response = self.client.post(self.track_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AnalyticsEvent.objects.count(), 1)
        event = AnalyticsEvent.objects.first()
        self.assertEqual(event.event_type, "page_view")
        self.assertEqual(event.path, "/shop")

    def test_empty_batch_returns_200(self):
        response = self.client.post(self.track_url, data=[], format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('count'), 0)
        self.assertEqual(AnalyticsEvent.objects.count(), 0)

    def test_valid_batch_recorded(self):
        payload = [
            {"event_type": "page_view", "path": "/"},
            {"event_type": "product_view", "product": self.product.id, "product_name": self.product.name},
            {"event_type": "whatsapp_click", "product": self.product.id, "source": "product_detail"}
        ]
        response = self.client.post(self.track_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data.get('count'), 3)
        self.assertEqual(AnalyticsEvent.objects.count(), 3)

    def test_batch_at_maximum_allowed_size_accepted(self):
        payload = [
            {"event_type": "page_view", "path": f"/page/{i}"}
            for i in range(25)
        ]
        response = self.client.post(self.track_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data.get('count'), 25)
        self.assertEqual(AnalyticsEvent.objects.count(), 25)

    def test_batch_exceeding_maximum_size_rejected(self):
        payload = [
            {"event_type": "page_view", "path": f"/page/{i}"}
            for i in range(26)
        ]
        response = self.client.post(self.track_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Batch size exceeds maximum allowed limit", response.data.get('error', ''))
        self.assertEqual(AnalyticsEvent.objects.count(), 0)

    def test_batch_with_invalid_item_returns_400(self):
        payload = [
            {"event_type": "page_view", "path": "/valid"},
            {"event_type": "invalid_choice_action", "path": "/bad"}
        ]
        response = self.client.post(self.track_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(AnalyticsEvent.objects.count(), 0)


class ProductPaginationAndSerializerTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name="Handloom", slug="handloom")
        for i in range(25):
            Product.objects.create(
                name=f"Product {i}",
                slug=f"product-{i}",
                sku=f"SKU-PAGE-{i}",
                price=1000 + i,
                category=self.category,
                is_active=True
            )

    def test_custom_page_size_query_param(self):
        response = self.client.get('/api/v1/products/?page_size=25')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', [])
        self.assertEqual(len(results), 25)

    def test_product_list_includes_updated_at(self):
        response = self.client.get('/api/v1/products/?page_size=1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', [])
        self.assertTrue(len(results) > 0)
        self.assertIn('updated_at', results[0])
        self.assertIsNotNone(results[0]['updated_at'])

    def test_category_list_includes_updated_at(self):
        response = self.client.get('/api/v1/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data.get('results', response.data)
        self.assertTrue(len(data) > 0)
        self.assertIn('updated_at', data[0])
        self.assertIsNotNone(data[0]['updated_at'])


class ReviewModerationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name="Sarees", slug="sarees")
        self.product = Product.objects.create(
            name="Assam Silk Saree",
            slug="assam-silk-saree",
            price=5000,
            category=self.category,
            is_active=True
        )

    def test_review_creation_defaults_to_unapproved(self):
        payload = {
            "user_name": "Customer A",
            "rating": 5,
            "comment": "Amazing quality saree!",
            "is_approved": True  # Attempt to tamper and self-approve
        }
        response = self.client.post(f'/api/v1/products/{self.product.slug}/reviews/', data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        from SHOP.models import Review
        review = Review.objects.get(product=self.product)
        self.assertFalse(review.is_approved, "Public submission must ignore is_approved=True and default to False")

        # Public list must NOT expose unapproved review
        list_response = self.client.get(f'/api/v1/products/{self.product.slug}/reviews/')
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        reviews_data = list_response.data.get('results', list_response.data)
        self.assertEqual(len(reviews_data), 0)

        # Product detail must NOT include unapproved review in rating or count
        detail_response = self.client.get(f'/api/v1/products/{self.product.slug}/')
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_response.data.get('review_count'), 0)
        self.assertEqual(detail_response.data.get('average_rating'), 0)
        self.assertEqual(len(detail_response.data.get('reviews', [])), 0)

        # Now approve review
        review.is_approved = True
        review.save()

        # Public list MUST now show approved review
        list_response_approved = self.client.get(f'/api/v1/products/{self.product.slug}/reviews/')
        reviews_approved_data = list_response_approved.data.get('results', list_response_approved.data)
        self.assertEqual(len(reviews_approved_data), 1)

        # Product detail MUST reflect approved rating and count
        detail_response_approved = self.client.get(f'/api/v1/products/{self.product.slug}/')
        self.assertEqual(detail_response_approved.data.get('review_count'), 1)
        self.assertEqual(detail_response_approved.data.get('average_rating'), 5.0)
        self.assertEqual(len(detail_response_approved.data.get('reviews', [])), 1)


class ProductPriceCacheAndFilteringTests(TestCase):
    def setUp(self):
        from django.core.cache import cache
        cache.clear()
        self.client = APIClient()
        self.category = Category.objects.create(name="Mekhela", slug="mekhela")
        self.other_category = Category.objects.create(name="Accessories", slug="accessories")
        self.p1 = Product.objects.create(
            name="Product Low",
            slug="product-low",
            sku="SKU-LOW",
            price=500,
            compare_price=700,
            category=self.category,
            badge="trending",
            stock_status="in_stock",
            is_active=True,
            is_featured=True
        )
        self.p2 = Product.objects.create(
            name="Product High",
            slug="product-high",
            sku="SKU-HIGH",
            price=9500,
            category=self.category,
            badge="best_seller",
            stock_status="out_of_stock",
            is_active=True,
            is_featured=False
        )

    def test_price_range_caching_and_invalidation(self):
        from django.core.cache import cache
        from SHOP.models import PRODUCT_PRICE_CACHE_KEY

        # First request populates cache
        res = self.client.get('/api/v1/products/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['min_price'], 500.0)
        self.assertEqual(res.data['max_price'], 9500.0)
        self.assertIsNotNone(cache.get(PRODUCT_PRICE_CACHE_KEY))

        # Update product price -> signal should invalidate cache
        self.p2.price = 12000
        self.p2.save()
        self.assertIsNone(cache.get(PRODUCT_PRICE_CACHE_KEY), "Cache should be invalidated after product save")

        # Next request gets updated values and recaches
        res2 = self.client.get('/api/v1/products/')
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertEqual(res2.data['max_price'], 12000.0)

        # Deleting product -> signal should invalidate cache
        self.p2.delete()
        self.assertIsNone(cache.get(PRODUCT_PRICE_CACHE_KEY), "Cache should be invalidated after product delete")

        res3 = self.client.get('/api/v1/products/')
        self.assertEqual(res3.status_code, status.HTTP_200_OK)
        self.assertEqual(res3.data['max_price'], 500.0)

    def test_product_filters(self):
        # Filter by min_price
        res = self.client.get('/api/v1/products/?min_price=1000')
        self.assertEqual(len(res.data['results']), 1)
        self.assertEqual(res.data['results'][0]['slug'], "product-high")

        # Filter by max_price
        res = self.client.get('/api/v1/products/?max_price=1000')
        self.assertEqual(len(res.data['results']), 1)
        self.assertEqual(res.data['results'][0]['slug'], "product-low")

        # Filter by badge
        res = self.client.get('/api/v1/products/?badge=trending')
        self.assertEqual(len(res.data['results']), 1)
        self.assertEqual(res.data['results'][0]['slug'], "product-low")

        # Filter by stock status
        res = self.client.get('/api/v1/products/?in_stock=true')
        self.assertEqual(len(res.data['results']), 1)
        self.assertEqual(res.data['results'][0]['slug'], "product-low")

        # Filter by sale
        res = self.client.get('/api/v1/products/?on_sale=true')
        self.assertEqual(len(res.data['results']), 1)
        self.assertEqual(res.data['results'][0]['slug'], "product-low")

        # Filter by is_featured
        res = self.client.get('/api/v1/products/?is_featured=true')
        self.assertEqual(len(res.data['results']), 1)
        self.assertEqual(res.data['results'][0]['slug'], "product-low")

        # Filter by category
        res = self.client.get('/api/v1/products/?category=accessories')
        self.assertEqual(len(res.data['results']), 0)

    def test_product_detail_inactive_404(self):
        self.p1.is_active = False
        self.p1.save()
        res = self.client.get(f'/api/v1/products/{self.p1.slug}/')
        # RetrieveAPIView on Product with queryset default
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_price_range_zero_price_boundary(self):
        from django.core.cache import cache
        from SHOP.models import PRODUCT_PRICE_CACHE_KEY

        # Remove existing products and create single product with price=0
        Product.objects.all().delete()
        cache.clear()

        Product.objects.create(
            name="Free Sample",
            slug="free-sample",
            sku="SKU-FREE",
            price=0,
            category=self.category,
            is_active=True
        )

        res = self.client.get('/api/v1/products/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['min_price'], 0.0)
        self.assertEqual(res.data['max_price'], 0.0, "Price of 0 must not falsely trigger default 100000 max_price fallback")

    def test_price_range_empty_catalog(self):
        from django.core.cache import cache
        from SHOP.models import PRODUCT_PRICE_CACHE_KEY

        Product.objects.all().delete()
        cache.clear()

        res = self.client.get('/api/v1/products/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['min_price'], 0.0)
        self.assertEqual(res.data['max_price'], 100000.0)

    def test_price_range_cache_corruption_recovery(self):
        from django.core.cache import cache
        from SHOP.models import PRODUCT_PRICE_CACHE_KEY

        # Set corrupt / non-dict cache
        cache.set(PRODUCT_PRICE_CACHE_KEY, "corrupt-cache-value", timeout=300)

        res = self.client.get('/api/v1/products/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['min_price'], 500.0)
        self.assertEqual(res.data['max_price'], 9500.0)



