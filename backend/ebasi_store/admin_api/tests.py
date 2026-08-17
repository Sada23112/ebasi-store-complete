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
