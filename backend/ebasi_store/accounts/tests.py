from io import StringIO
from unittest.mock import patch
from django.test import TestCase
from django.core.management import call_command
from django.contrib.auth import get_user_model

User = get_user_model()


class AutoCreateSuperuserTestCase(TestCase):
    def test_missing_username_skips_gracefully(self):
        out = StringIO()
        with patch('accounts.management.commands.auto_create_superuser.config') as mock_config:
            mock_config.side_effect = lambda key, default=None, cast=None: None
            call_command('auto_create_superuser', stdout=out)
        self.assertIn("DJANGO_SUPERUSER_USERNAME is not set", out.getvalue())
        self.assertEqual(User.objects.filter(is_superuser=True).count(), 0)

    def test_create_new_superuser_requires_password(self):
        out = StringIO()
        with patch('accounts.management.commands.auto_create_superuser.config') as mock_config:
            def config_side_effect(key, default=None, cast=None):
                if key == "DJANGO_SUPERUSER_USERNAME":
                    return "newadmin"
                if key == "DJANGO_SUPERUSER_PASSWORD":
                    return None
                return default
            mock_config.side_effect = config_side_effect
            call_command('auto_create_superuser', stdout=out)

        self.assertIn("DJANGO_SUPERUSER_PASSWORD is required", out.getvalue())
        self.assertFalse(User.objects.filter(username="newadmin").exists())

    def test_create_new_superuser_success(self):
        out = StringIO()
        with patch('accounts.management.commands.auto_create_superuser.config') as mock_config:
            def config_side_effect(key, default=None, cast=None):
                if key == "DJANGO_SUPERUSER_USERNAME":
                    return "newadmin"
                if key == "DJANGO_SUPERUSER_EMAIL":
                    return "admin@example.com"
                if key == "DJANGO_SUPERUSER_PASSWORD":
                    return "SuperSecret_123"
                return default
            mock_config.side_effect = config_side_effect
            call_command('auto_create_superuser', stdout=out)

        self.assertIn("Successfully created new superuser", out.getvalue())
        user = User.objects.get(username="newadmin")
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_active)
        self.assertTrue(user.check_password("SuperSecret_123"))

    def test_existing_superuser_preserves_password_by_default(self):
        # Create user with initial password
        user = User.objects.create_superuser(
            username="existingadmin",
            email="existing@example.com",
            password="OriginalCustomPassword_99"
        )

        out = StringIO()
        with patch('accounts.management.commands.auto_create_superuser.config') as mock_config:
            def config_side_effect(key, default=None, cast=None):
                if key == "DJANGO_SUPERUSER_USERNAME":
                    return "existingadmin"
                if key == "DJANGO_SUPERUSER_PASSWORD":
                    return "DifferentPassword_12"
                return default
            mock_config.side_effect = config_side_effect
            call_command('auto_create_superuser', stdout=out)

        self.assertIn("Preserving existing password", out.getvalue())
        user.refresh_from_db()
        self.assertTrue(user.check_password("OriginalCustomPassword_99"))
        self.assertFalse(user.check_password("DifferentPassword_12"))

    def test_existing_superuser_resets_password_when_explicitly_flagged(self):
        user = User.objects.create_superuser(
            username="existingadmin",
            email="existing@example.com",
            password="OriginalCustomPassword_99"
        )

        out = StringIO()
        with patch('accounts.management.commands.auto_create_superuser.config') as mock_config:
            def config_side_effect(key, default=None, cast=None):
                if key == "DJANGO_SUPERUSER_USERNAME":
                    return "existingadmin"
                if key == "DJANGO_SUPERUSER_PASSWORD":
                    return "NewlyResetPassword_456"
                return default
            mock_config.side_effect = config_side_effect
            call_command('auto_create_superuser', reset_password=True, stdout=out)

        self.assertIn("Successfully reset password", out.getvalue())
        user.refresh_from_db()
        self.assertTrue(user.check_password("NewlyResetPassword_456"))

    def test_create_superuser_script_delegation(self):
        """create_superuser.py script delegates to auto_create_superuser safely."""
        from create_superuser import main as create_superuser_main
        import sys

        user = User.objects.create_superuser(
            username="scriptadmin",
            email="script@example.com",
            password="ScriptPassword_1"
        )

        with patch('accounts.management.commands.auto_create_superuser.config') as mock_config:
            def config_side_effect(key, default=None, cast=None):
                if key == "DJANGO_SUPERUSER_USERNAME":
                    return "scriptadmin"
                if key == "DJANGO_SUPERUSER_PASSWORD":
                    return "ScriptPassword_2"
                return default
            mock_config.side_effect = config_side_effect

            # Default run without --reset-password preserves password
            with patch.object(sys, 'argv', ['create_superuser.py']):
                create_superuser_main()
            user.refresh_from_db()
            self.assertTrue(user.check_password("ScriptPassword_1"))

            # Explicit run with --reset-password resets password
            with patch.object(sys, 'argv', ['create_superuser.py', '--reset-password']):
                create_superuser_main()
            user.refresh_from_db()
            self.assertTrue(user.check_password("ScriptPassword_2"))


from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import ContactMessage, StaffProfile


class ContactMessageViewTests(TestCase):
    def setUp(self):
        from django.core.cache import cache
        cache.clear()
        self.client = APIClient()
        self.contact_url = '/api/v1/accounts/contact/'

    def tearDown(self):
        from django.core.cache import cache
        cache.clear()

    def test_valid_contact_message_submission(self):
        payload = {
            "name": "Rini Saikia",
            "email": "rini@example.com",
            "phone": "+91 9876543210",
            "subject": "Handloom Order Query",
            "message": "Interested in custom bulk ordering for wedding."
        }
        res = self.client.post(self.contact_url, data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', res.data)
        self.assertIn('id', res.data)

        # Verify DB
        msg = ContactMessage.objects.get(email="rini@example.com")
        self.assertEqual(msg.name, "Rini Saikia")
        self.assertEqual(msg.subject, "Handloom Order Query")
        self.assertFalse(msg.is_read)

    def test_invalid_contact_message_missing_required_fields(self):
        payload = {
            "phone": "+91 9876543210"
        }
        res = self.client.post(self.contact_url, data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('details', res.data)
        self.assertIn('name', res.data['details'])
        self.assertIn('email', res.data['details'])
        self.assertIn('subject', res.data['details'])
        self.assertIn('message', res.data['details'])

    def test_invalid_email_format(self):
        payload = {
            "name": "Test User",
            "email": "invalid-email-address",
            "subject": "Test",
            "message": "Hello"
        }
        res = self.client.post(self.contact_url, data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', res.data['details'])

    def test_internal_error_handling_returns_500(self):
        payload = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Test",
            "message": "Hello"
        }
        with patch('accounts.serializers.ContactMessageSerializer.save', side_effect=RuntimeError("Database down")):
            res = self.client.post(self.contact_url, data=payload, format='json')
            self.assertEqual(res.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
            self.assertIn('error', res.data)

    def test_contact_message_with_forwarded_for_header(self):
        payload = {
            "name": "Proxy User",
            "email": "proxy@example.com",
            "subject": "Order Inquiries",
            "message": "Testing IP resolution behind reverse proxy."
        }
        res = self.client.post(
            self.contact_url,
            data=payload,
            format='json',
            HTTP_X_FORWARDED_FOR='203.0.113.195, 70.41.3.18, 150.172.238.178'
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_contact_message_with_empty_forwarded_for_falls_back_to_remote_addr(self):
        payload = {
            "name": "Direct User",
            "email": "direct@example.com",
            "subject": "General",
            "message": "Testing fallback to REMOTE_ADDR."
        }
        res = self.client.post(
            self.contact_url,
            data=payload,
            format='json',
            HTTP_X_FORWARDED_FOR='',
            REMOTE_ADDR='192.168.1.100'
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)



class AdminLoginViewTests(TestCase):
    def setUp(self):
        from django.core.cache import cache
        cache.clear()
        self.client = APIClient()
        self.login_url = '/api/v1/accounts/admin/login/'

        # Create staff user
        self.staff_user = User.objects.create_user(
            username="staff_member",
            email="staff@ebasi.com",
            password="SecureStaffPassword_123",
            is_staff=True,
            is_active=True
        )
        StaffProfile.objects.create(user=self.staff_user, role='manager')

        # Create normal non-staff user
        self.regular_user = User.objects.create_user(
            username="regular_user",
            email="regular@example.com",
            password="RegularPassword_123",
            is_staff=False,
            is_active=True
        )

        # Create inactive staff user
        self.inactive_staff = User.objects.create_user(
            username="inactive_staff",
            email="inactive@ebasi.com",
            password="InactivePassword_123",
            is_staff=True,
            is_active=False
        )

    def tearDown(self):
        from django.core.cache import cache
        cache.clear()

    def test_staff_login_success_with_username(self):
        payload = {
            "username": "staff_member",
            "password": "SecureStaffPassword_123"
        }
        res = self.client.post(self.login_url, data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('token', res.data)
        self.assertEqual(res.data['username'], "staff_member")
        self.assertEqual(res.data['role'], "manager")
        self.assertTrue(res.data['is_staff'])

    def test_staff_login_success_with_email(self):
        payload = {
            "email": "staff@ebasi.com",
            "password": "SecureStaffPassword_123"
        }
        res = self.client.post(self.login_url, data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('token', res.data)

    def test_non_staff_user_denied_access(self):
        payload = {
            "username": "regular_user",
            "password": "RegularPassword_123"
        }
        res = self.client.post(self.login_url, data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("do not have permission", res.data.get('error', ''))

    def test_inactive_staff_user_denied_access(self):
        payload = {
            "username": "inactive_staff",
            "password": "InactivePassword_123"
        }
        res = self.client.post(self.login_url, data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("deactivated", res.data.get('error', ''))

    def test_invalid_password_returns_400(self):
        payload = {
            "username": "staff_member",
            "password": "WrongPassword_999"
        }
        res = self.client.post(self.login_url, data=payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Invalid username, email, or password", res.data.get('error', ''))


class UserDetailViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="profile_user",
            email="profile@example.com",
            password="Password_123",
            first_name="First",
            last_name="Last"
        )
        self.profile_url = '/api/v1/accounts/profile/'

    def test_unauthenticated_profile_access_denied(self):
        res = self.client.get(self.profile_url)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_profile_retrieve_and_update(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.get(self.profile_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['username'], "profile_user")
        self.assertEqual(res.data['first_name'], "First")

        # Update first name
        update_res = self.client.patch(self.profile_url, {'first_name': 'UpdatedFirst'}, format='json')
        self.assertEqual(update_res.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "UpdatedFirst")

