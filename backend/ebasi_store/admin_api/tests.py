from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework import status

from SHOP.models import Category, Product, Review
from accounts.models import ContactMessage, StaffProfile
from admin_api.models import AuditLog
from admin_api.permissions import Roles


class RBACAndStaffManagementTestCase(APITestCase):
    def setUp(self):
        # 1. Create Base Test Category and Product
        self.category = Category.objects.create(
            name="Silk Sarees",
            slug="silk-sarees",
            description="Premium Silk Sarees"
        )
        self.product = Product.objects.create(
            name="Banarasi Silk Saree",
            slug="banarasi-silk-saree",
            category=self.category,
            price=4999.00,
            sku="EBA-TEST01",
            stock_quantity=10,
            stock_status="in_stock",
            is_active=True
        )
        self.review = Review.objects.create(
            product=self.product,
            user_name="Priya Sharma",
            rating=5,
            comment="Exquisite fabric and craftsmanship!"
        )
        self.message = ContactMessage.objects.create(
            name="Ananya Roy",
            email="ananya@example.com",
            subject="Custom Saree Inquiry",
            message="Do you do custom bridal embroidery?"
        )

        # 2. Create Users with Different RBAC Roles
        # Owner / Super Admin
        self.owner = User.objects.create_superuser(
            username="owner_user",
            email="owner@ebasistore.com",
            password="OwnerPassword123!"
        )
        self.owner_token = Token.objects.create(user=self.owner)

        # Second Owner (to test multi-owner safeguards)
        self.owner2 = User.objects.create_user(
            username="owner2_user",
            email="owner2@ebasistore.com",
            password="Owner2Password123!",
            is_staff=True,
            is_superuser=True
        )
        StaffProfile.objects.create(user=self.owner2, role=Roles.OWNER)
        self.owner2_token = Token.objects.create(user=self.owner2)

        # Manager
        self.manager = User.objects.create_user(
            username="manager_user",
            email="manager@ebasistore.com",
            password="ManagerPassword123!",
            is_staff=True,
            is_superuser=False
        )
        StaffProfile.objects.create(user=self.manager, role=Roles.MANAGER)
        self.manager_token = Token.objects.create(user=self.manager)

        # Staff
        self.staff = User.objects.create_user(
            username="staff_user",
            email="staff@ebasistore.com",
            password="StaffPassword123!",
            is_staff=True,
            is_superuser=False
        )
        StaffProfile.objects.create(user=self.staff, role=Roles.STAFF)
        self.staff_token = Token.objects.create(user=self.staff)

        # Viewer
        self.viewer = User.objects.create_user(
            username="viewer_user",
            email="viewer@ebasistore.com",
            password="ViewerPassword123!",
            is_staff=True,
            is_superuser=False
        )
        StaffProfile.objects.create(user=self.viewer, role=Roles.VIEWER)
        self.viewer_token = Token.objects.create(user=self.viewer)

        # Inactive Staff
        self.inactive_staff = User.objects.create_user(
            username="inactive_staff",
            email="inactive@ebasistore.com",
            password="InactivePassword123!",
            is_staff=True,
            is_superuser=False,
            is_active=False
        )
        StaffProfile.objects.create(user=self.inactive_staff, role=Roles.STAFF)
        self.inactive_token = Token.objects.create(user=self.inactive_staff)

        # Customer (Non-staff)
        self.customer = User.objects.create_user(
            username="customer_user",
            email="customer@example.com",
            password="CustomerPassword123!",
            is_staff=False,
            is_superuser=False
        )
        self.customer_token = Token.objects.create(user=self.customer)

    # --------------------------------------------------------------------------
    # 1. Authentication & Inactive Account Tests
    # --------------------------------------------------------------------------
    def test_unauthenticated_access_returns_401(self):
        """Unauthenticated requests to admin endpoints must return 401."""
        endpoints = [
            "/api/v1/admin/dashboard/",
            "/api/v1/admin/analytics/",
            "/api/v1/admin/products/",
            "/api/v1/admin/categories/",
            "/api/v1/admin/reviews/",
            "/api/v1/admin/contacts/",
            "/api/v1/admin/staff/",
            "/api/v1/admin/me/",
        ]
        for ep in endpoints:
            response = self.client.get(ep)
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED, f"Endpoint {ep} did not return 401")

    def test_non_staff_customer_access_returns_403(self):
        """Customer without is_staff attempting admin endpoints must return 403."""
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.customer_token.key}")
        response = self.client.get("/api/v1/admin/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_inactive_staff_token_access_rejected(self):
        """Inactive staff token must be rejected with 401 or 403."""
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.inactive_token.key}")
        response = self.client.get("/api/v1/admin/dashboard/")
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_inactive_staff_login_rejected(self):
        """Inactive staff user cannot login via AdminLoginView."""
        response = self.client.post("/api/v1/accounts/admin/login/", {
            "username": "inactive_staff",
            "password": "InactivePassword123!"
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("deactivated", response.data.get("error", "").lower())

    def test_active_staff_login_returns_role_and_permissions(self):
        """Active staff login returns token, role, and permissions."""
        response = self.client.post("/api/v1/accounts/admin/login/", {
            "username": "manager_user",
            "password": "ManagerPassword123!"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("role"), "manager")
        self.assertIn("products.create", response.data.get("permissions", []))
        self.assertNotIn("staff.create", response.data.get("permissions", []))

    # --------------------------------------------------------------------------
    # 2. Owner Role Tests (Full Unrestricted Access)
    # --------------------------------------------------------------------------
    def test_owner_full_access(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.owner_token.key}")

        # Overview & Analytics
        res = self.client.get("/api/v1/admin/dashboard/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        res = self.client.get("/api/v1/admin/analytics/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Product CRUD
        res = self.client.post("/api/v1/admin/products/", {
            "name": "Owner Created Saree",
            "price": 2999,
            "category_id": self.category.id,
            "sku": "EBA-OWN01"
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        new_prod_id = res.data["id"]

        res = self.client.patch(f"/api/v1/admin/products/{new_prod_id}/", {"price": 3499})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        res = self.client.delete(f"/api/v1/admin/products/{new_prod_id}/")
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

        # Staff Management
        res = self.client.get("/api/v1/admin/staff/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        res = self.client.post("/api/v1/admin/staff/", {
            "username": "new_hire_staff",
            "email": "newhire@ebasistore.com",
            "password": "SecurePassword123!",
            "role": "staff"
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    # --------------------------------------------------------------------------
    # 3. Manager Role Tests
    # --------------------------------------------------------------------------
    def test_manager_permissions(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.manager_token.key}")

        # Dashboard & Analytics: Allowed
        self.assertEqual(self.client.get("/api/v1/admin/dashboard/").status_code, status.HTTP_200_OK)
        self.assertEqual(self.client.get("/api/v1/admin/analytics/").status_code, status.HTTP_200_OK)

        # Products CRUD: Allowed
        res = self.client.post("/api/v1/admin/products/", {
            "name": "Manager Product",
            "price": 1999,
            "category_id": self.category.id,
            "sku": "EBA-MGR01"
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # Category CRUD: Allowed
        res_cat = self.client.post("/api/v1/admin/categories/", {"name": "Manager Category"})
        self.assertEqual(res_cat.status_code, status.HTTP_201_CREATED)

        # Review Moderation: Allowed
        self.assertEqual(self.client.delete(f"/api/v1/admin/reviews/{self.review.id}/").status_code, status.HTTP_204_NO_CONTENT)

        # Message Management: Allowed
        self.assertEqual(self.client.patch(f"/api/v1/admin/contacts/{self.message.id}/mark-read/").status_code, status.HTTP_200_OK)

        # Staff Management: FORBIDDEN (403)
        self.assertEqual(self.client.get("/api/v1/admin/staff/").status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.post("/api/v1/admin/staff/", {
            "username": "illegal_staff",
            "email": "illegal@example.com",
            "password": "Password123!",
            "role": "staff"
        }).status_code, status.HTTP_403_FORBIDDEN)

        # Audit Logs: FORBIDDEN (403)
        self.assertEqual(self.client.get("/api/v1/admin/audit-logs/").status_code, status.HTTP_403_FORBIDDEN)

    # --------------------------------------------------------------------------
    # 4. Staff Role Tests
    # --------------------------------------------------------------------------
    def test_staff_permissions(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.staff_token.key}")

        # Dashboard: Allowed
        self.assertEqual(self.client.get("/api/v1/admin/dashboard/").status_code, status.HTTP_200_OK)

        # Analytics: FORBIDDEN (403)
        self.assertEqual(self.client.get("/api/v1/admin/analytics/").status_code, status.HTTP_403_FORBIDDEN)

        # Products CRUD: Allowed
        res = self.client.post("/api/v1/admin/products/", {
            "name": "Staff Product",
            "price": 1299,
            "category_id": self.category.id,
            "sku": "EBA-STF01"
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # Category READ: Allowed (to assign categories to products)
        self.assertEqual(self.client.get("/api/v1/admin/categories/").status_code, status.HTTP_200_OK)

        # Category CREATE/DELETE: FORBIDDEN (403)
        self.assertEqual(self.client.post("/api/v1/admin/categories/", {"name": "Staff Category"}).status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.delete(f"/api/v1/admin/categories/{self.category.id}/").status_code, status.HTTP_403_FORBIDDEN)

        # Staff Management: FORBIDDEN (403)
        self.assertEqual(self.client.get("/api/v1/admin/staff/").status_code, status.HTTP_403_FORBIDDEN)

    # --------------------------------------------------------------------------
    # 5. Viewer Role Tests (Strict Read-Only)
    # --------------------------------------------------------------------------
    def test_viewer_permissions(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.viewer_token.key}")

        # Read operations: Allowed
        self.assertEqual(self.client.get("/api/v1/admin/dashboard/").status_code, status.HTTP_200_OK)
        self.assertEqual(self.client.get("/api/v1/admin/analytics/").status_code, status.HTTP_200_OK)
        self.assertEqual(self.client.get("/api/v1/admin/products/").status_code, status.HTTP_200_OK)
        self.assertEqual(self.client.get("/api/v1/admin/categories/").status_code, status.HTTP_200_OK)
        self.assertEqual(self.client.get("/api/v1/admin/reviews/").status_code, status.HTTP_200_OK)
        self.assertEqual(self.client.get("/api/v1/admin/contacts/").status_code, status.HTTP_200_OK)

        # Mutation operations: All FORBIDDEN (403)
        self.assertEqual(self.client.post("/api/v1/admin/products/", {
            "name": "Viewer Product",
            "price": 100,
            "category_id": self.category.id
        }).status_code, status.HTTP_403_FORBIDDEN)

        self.assertEqual(self.client.patch(f"/api/v1/admin/products/{self.product.id}/", {"price": 100}).status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.delete(f"/api/v1/admin/products/{self.product.id}/").status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.post("/api/v1/admin/categories/", {"name": "Viewer Cat"}).status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.delete(f"/api/v1/admin/reviews/{self.review.id}/").status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.patch(f"/api/v1/admin/contacts/{self.message.id}/mark-read/").status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.delete(f"/api/v1/admin/contacts/{self.message.id}/").status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.get("/api/v1/admin/staff/").status_code, status.HTTP_403_FORBIDDEN)

    # --------------------------------------------------------------------------
    # 6. Privilege Escalation & Security Safeguard Tests
    # --------------------------------------------------------------------------
    def test_privilege_escalation_prevented(self):
        """Non-owners cannot change roles or promote themselves."""
        for user, token in [(self.manager, self.manager_token), (self.staff, self.staff_token), (self.viewer, self.viewer_token)]:
            self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
            # Try to change own role to owner
            res = self.client.patch(f"/api/v1/admin/staff/{user.id}/role/", {"role": "owner"})
            self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN, f"{user.username} was able to change role")

    def test_prevent_last_active_owner_deactivation(self):
        """Cannot deactivate the sole active owner."""
        # Deactivate owner2 first so owner is the only active owner
        self.owner2.is_active = False
        self.owner2.save()

        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.owner_token.key}")
        # Attempt to deactivate the only active owner
        res = self.client.patch(f"/api/v1/admin/staff/{self.owner.id}/deactivate/")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_prevent_last_active_owner_demotion(self):
        """Cannot demote the sole active owner to staff/manager/viewer."""
        self.owner2.is_active = False
        self.owner2.save()

        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.owner_token.key}")
        res = self.client.patch(f"/api/v1/admin/staff/{self.owner.id}/role/", {"role": "staff"})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("only active Owner", res.data.get("error", ""))

    def test_prevent_self_deactivation(self):
        """Staff member cannot deactivate their own account."""
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.owner_token.key}")
        res = self.client.patch(f"/api/v1/admin/staff/{self.owner.id}/deactivate/")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_deactivation_immediately_revokes_tokens(self):
        """Deactivating a staff account immediately deletes all associated auth tokens."""
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.owner_token.key}")
        self.assertTrue(Token.objects.filter(user=self.staff).exists())

        res = self.client.patch(f"/api/v1/admin/staff/{self.staff.id}/deactivate/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Verify token is deleted
        self.assertFalse(Token.objects.filter(user=self.staff).exists())

        # Verify staff token request now fails
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.staff_token.key}")
        res = self.client.get("/api/v1/admin/dashboard/")
        self.assertIn(res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_audit_logs_recorded(self):
        """Mutations must generate audit log entries."""
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.owner_token.key}")
        self.client.post("/api/v1/admin/products/", {
            "name": "Audit Tracked Saree",
            "price": 1500,
            "category_id": self.category.id,
            "sku": "EBA-AUD01"
        })

        self.assertTrue(AuditLog.objects.filter(action="product.create", actor=self.owner).exists())


class AdminProductAndAnalyticsOptimizationTestCase(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_superuser(
            username="admin_opt_owner",
            email="opt_owner@ebasistore.com",
            password="OptPassword123!"
        )
        self.token = Token.objects.create(user=self.owner)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

        self.category = Category.objects.create(name="Egu Jokasiba", slug="egu-jokasiba")
        self.product = Product.objects.create(
            name="Deori Traditional Egu",
            slug="deori-traditional-egu",
            category=self.category,
            price=3200,
            sku="EBA-OPT01"
        )

    def test_admin_product_list_annotated_counts_with_zero(self):
        """Zero counts should return 0 directly without executing fallback queries."""
        from SHOP.models import AnalyticsEvent
        from admin_api.serializers import AdminProductSerializer

        # Create multiple products to verify constant query count (no N+1 per product)
        for i in range(5):
            Product.objects.create(
                name=f"Deori Egu {i}",
                slug=f"deori-egu-{i}",
                category=self.category,
                price=2000 + i * 100,
                sku=f"EBA-OPT-{i}"
            )

        # Ensure that list queries do not trigger N+1 queries per product for counts or avg rating
        with self.assertNumQueries(7):
            res = self.client.get("/api/v1/admin/products/")
            self.assertEqual(res.status_code, status.HTTP_200_OK)
            results = res.data.get('results', res.data)
            self.assertEqual(len(results), 6)
            for prod in results:
                self.assertEqual(prod['views_count'], 0)
                self.assertEqual(prod['wishlist_count'], 0)
                self.assertEqual(prod['whatsapp_clicks_count'], 0)
                self.assertEqual(prod['average_rating'], 0)
                self.assertEqual(prod['review_count'], 0)

        # Directly test serializer method with annotated 0 and None avg rating
        setattr(self.product, 'annotated_views_count', 0)
        setattr(self.product, 'annotated_wishlist_count', 0)
        setattr(self.product, 'annotated_whatsapp_count', 0)
        setattr(self.product, 'annotated_avg_rating', None)
        serializer = AdminProductSerializer(self.product)
        self.assertEqual(serializer.data['views_count'], 0)
        self.assertEqual(serializer.data['wishlist_count'], 0)
        self.assertEqual(serializer.data['whatsapp_clicks_count'], 0)
        self.assertEqual(serializer.data['average_rating'], 0)

    def test_admin_analytics_view_aggregations(self):
        """AdminAnalyticsView uses single TruncDate query, handles time windows, and avoids N+1 queries."""
        from SHOP.models import AnalyticsEvent
        from django.utils import timezone
        from datetime import timedelta

        now = timezone.now()
        # Event within 7 days
        e1 = AnalyticsEvent.objects.create(
            event_type='product_view',
            product=self.product,
            product_name=self.product.name
        )
        e2 = AnalyticsEvent.objects.create(
            event_type='whatsapp_click',
            product=self.product,
            product_name=self.product.name
        )
        # Event older than 7 days (created 12 days ago)
        e3 = AnalyticsEvent.objects.create(
            event_type='product_view',
            product=self.product,
            product_name=self.product.name
        )
        AnalyticsEvent.objects.filter(id=e3.id).update(created_at=now - timedelta(days=12))

        # Query count must remain O(1) regardless of days range (auth + daily + products + images + searches + funnel)
        with self.assertNumQueries(6):
            res = self.client.get("/api/v1/admin/analytics/?days=7")
            self.assertEqual(res.status_code, status.HTTP_200_OK)

        self.assertEqual(res.data['timeframe_days'], 7)
        self.assertEqual(len(res.data['daily_series']), 7)

        # Funnel counts: period views = 1 (e3 excluded), wa = 1
        self.assertEqual(res.data['funnel']['product_views'], 1)
        self.assertEqual(res.data['funnel']['whatsapp_inquiries'], 1)

        # Product performance breakdown: period_views = 1, total_views = 2
        perf = res.data['product_performance']
        prod_perf = next((p for p in perf if p['id'] == self.product.id), None)
        self.assertIsNotNone(prod_perf)
        self.assertEqual(prod_perf['period_views'], 1)
        self.assertEqual(prod_perf['total_views'], 2)
        self.assertEqual(prod_perf['period_whatsapp_clicks'], 1)
        self.assertEqual(prod_perf['total_whatsapp_clicks'], 1)


class AdminReviewModerationTestCase(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Silk", slug="silk")
        self.product = Product.objects.create(
            name="Assam Silk Mekhela",
            slug="assam-silk-mekhela",
            category=self.category,
            price=3500.00,
            sku="EBA-MEKHELA-01",
            is_active=True
        )
        self.review = Review.objects.create(
            product=self.product,
            user_name="Anita",
            rating=5,
            comment="Gorgeous!",
            is_approved=False
        )
        self.staff_user = User.objects.create_user(
            username="staff_mod",
            email="staff_mod@ebasistore.com",
            password="ModPassword123!",
            is_staff=True
        )
        StaffProfile.objects.create(user=self.staff_user, role=Roles.STAFF)
        self.token = Token.objects.create(user=self.staff_user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

    def test_filter_reviews_by_approval_status(self):
        res = self.client.get("/api/v1/admin/reviews/?is_approved=false")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data.get('results', res.data)
        self.assertEqual(len(results), 1)

        res_approved = self.client.get("/api/v1/admin/reviews/?is_approved=true")
        self.assertEqual(res_approved.status_code, status.HTTP_200_OK)
        results_approved = res_approved.data.get('results', res_approved.data)
        self.assertEqual(len(results_approved), 0)

    def test_approve_and_reject_review_endpoints(self):
        # Approve
        approve_res = self.client.post(f"/api/v1/admin/reviews/{self.review.id}/approve/")
        self.assertEqual(approve_res.status_code, status.HTTP_200_OK)
        self.review.refresh_from_db()
        self.assertTrue(self.review.is_approved)

        # Audit log logged
        self.assertTrue(AuditLog.objects.filter(action='review.moderate').exists())

        # Reject
        reject_res = self.client.post(f"/api/v1/admin/reviews/{self.review.id}/reject/")
        self.assertEqual(reject_res.status_code, status.HTTP_200_OK)
        self.review.refresh_from_db()
        self.assertFalse(self.review.is_approved)

    def test_admin_patch_review_and_audit_log(self):
        patch_res = self.client.patch(
            f"/api/v1/admin/reviews/{self.review.id}/",
            data={"comment": "Updated by staff", "is_approved": True},
            format='json'
        )
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.review.refresh_from_db()
        self.assertEqual(self.review.comment, "Updated by staff")
        self.assertTrue(self.review.is_approved)
        self.assertTrue(AuditLog.objects.filter(action='review.update').exists())

    def test_admin_product_rating_excludes_unapproved_review(self):
        # Product detail in admin API must not count unapproved review
        res = self.client.get(f"/api/v1/admin/products/{self.product.id}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data.get('review_count'), 0)
        self.assertEqual(res.data.get('average_rating'), 0)

        # Now approve review
        self.review.is_approved = True
        self.review.save()

        res_approved = self.client.get(f"/api/v1/admin/products/{self.product.id}/")
        self.assertEqual(res_approved.status_code, status.HTTP_200_OK)
        self.assertEqual(res_approved.data.get('review_count'), 1)
        self.assertEqual(res_approved.data.get('average_rating'), 5.0)


