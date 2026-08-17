from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token

from accounts.models import StaffProfile
from admin_api.models import AuditLog
from .models import StoreProfile, SocialLink, HeroSection, PageContent


class CmsSystemTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create Owner User
        self.owner_user = User.objects.create_superuser(
            username='owner_cms',
            email='owner@ebasistore.com',
            password='Password123!'
        )
        StaffProfile.objects.create(user=self.owner_user, role='owner')
        self.owner_token = Token.objects.create(user=self.owner_user)

        # Create Manager User
        self.manager_user = User.objects.create_user(
            username='manager_cms',
            email='manager@ebasistore.com',
            password='Password123!',
            is_staff=True
        )
        StaffProfile.objects.create(user=self.manager_user, role='manager')
        self.manager_token = Token.objects.create(user=self.manager_user)

        # Create Staff User
        self.staff_user = User.objects.create_user(
            username='staff_cms',
            email='staff@ebasistore.com',
            password='Password123!',
            is_staff=True
        )
        StaffProfile.objects.create(user=self.staff_user, role='staff')
        self.staff_token = Token.objects.create(user=self.staff_user)

        # Create Viewer User
        self.viewer_user = User.objects.create_user(
            username='viewer_cms',
            email='viewer@ebasistore.com',
            password='Password123!',
            is_staff=True
        )
        StaffProfile.objects.create(user=self.viewer_user, role='viewer')
        self.viewer_token = Token.objects.create(user=self.viewer_user)

    def test_public_config_endpoint(self):
        """Public configuration returns accurate store info, social links, and hero data."""
        res = self.client.get('/api/v1/cms/config/')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn('store', data)
        self.assertIn('social_links', data)
        self.assertIn('hero', data)
        self.assertEqual(data['store']['name'], 'Ms Ebasi Store')
        self.assertEqual(data['store']['phone'], '073992 91242')
        self.assertTrue(len(data['social_links']) > 0)

    def test_public_page_content_endpoints(self):
        """Public pages (about, privacy-policy, terms-of-service, contact) are accessible."""
        for slug in ['about', 'privacy-policy', 'terms-of-service', 'contact']:
            res = self.client.get(f'/api/v1/cms/pages/{slug}/')
            self.assertEqual(res.status_code, 200, f"Failed for page slug: {slug}")
            self.assertEqual(res.json()['slug'], slug)

    def test_public_page_invalid_slug_returns_404(self):
        """Invalid slug returns 404."""
        res = self.client.get('/api/v1/cms/pages/nonexistent-page-slug/')
        self.assertEqual(res.status_code, 404)

    def test_unauthenticated_admin_cms_access_denied(self):
        """Unauthenticated requests to admin CMS endpoints return 401."""
        res = self.client.get('/api/v1/admin/cms/store/')
        self.assertEqual(res.status_code, 401)
        res = self.client.get('/api/v1/admin/cms/hero/')
        self.assertEqual(res.status_code, 401)
        res = self.client.get('/api/v1/admin/cms/social-links/')
        self.assertEqual(res.status_code, 401)
        res = self.client.get('/api/v1/admin/cms/pages/')
        self.assertEqual(res.status_code, 401)

    def test_viewer_can_read_but_cannot_modify_cms(self):
        """Viewer has read access (200) but cannot perform updates (403)."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.viewer_token.key}')
        
        # Read is allowed
        res = self.client.get('/api/v1/admin/cms/store/')
        self.assertEqual(res.status_code, 200)

        res = self.client.get('/api/v1/admin/cms/hero/')
        self.assertEqual(res.status_code, 200)

        # Mutation is forbidden
        res = self.client.patch('/api/v1/admin/cms/store/', {'phone': '0123456789'}, format='json')
        self.assertEqual(res.status_code, 403)

        res = self.client.patch('/api/v1/admin/cms/hero/', {'heading': 'New Hero Title'}, format='json')
        self.assertEqual(res.status_code, 403)

        res = self.client.post('/api/v1/admin/cms/social-links/', {
            'platform': 'other',
            'url': 'https://example.com',
            'display_name': 'Example'
        }, format='json')
        self.assertEqual(res.status_code, 403)

    def test_manager_can_update_store_profile_and_logs_audit(self):
        """Manager can update business details and an audit log entry is recorded."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.manager_token.key}')
        
        res = self.client.patch('/api/v1/admin/cms/store/', {
            'phone': '073992 99999',
            'tagline': 'Authentic Handcrafted Elegance.'
        }, format='json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['phone'], '073992 99999')
        self.assertEqual(res.json()['tagline'], 'Authentic Handcrafted Elegance.')

        # Verify audit log
        audit = AuditLog.objects.filter(action='content.store_update').first()
        self.assertIsNotNone(audit)
        self.assertEqual(audit.actor_username, 'manager_cms')

    def test_social_links_crud_operations(self):
        """Manager can create, update, toggle and delete social links."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.manager_token.key}')

        # Create
        res = self.client.post('/api/v1/admin/cms/social-links/', {
            'platform': 'other',
            'display_name': 'Threads',
            'handle': '@ebasistore',
            'url': 'https://threads.net/@ebasistore',
            'is_enabled': True,
            'order': 5
        }, format='json')
        self.assertEqual(res.status_code, 201)
        link_id = res.json()['id']

        # Toggle
        res = self.client.patch(f'/api/v1/admin/cms/social-links/{link_id}/toggle-enabled/')
        self.assertEqual(res.status_code, 200)
        self.assertFalse(res.json()['is_enabled'])

        # Delete
        res = self.client.delete(f'/api/v1/admin/cms/social-links/{link_id}/')
        self.assertEqual(res.status_code, 204)

    def test_invalid_social_url_rejected(self):
        """Invalid URL format is rejected by serializer."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.manager_token.key}')
        res = self.client.post('/api/v1/admin/cms/social-links/', {
            'platform': 'other',
            'url': 'invalid-url-string',
            'display_name': 'Bad Link'
        }, format='json')
        self.assertEqual(res.status_code, 400)

    def test_hero_section_update(self):
        """Manager can update hero section content."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.manager_token.key}')
        res = self.client.patch('/api/v1/admin/cms/hero/', {
            'heading': 'Heritage Weaves of Assam.',
            'cta_text': 'Explore Handlooms'
        }, format='json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['heading'], 'Heritage Weaves of Assam.')
        self.assertEqual(res.json()['cta_text'], 'Explore Handlooms')

    def test_page_content_update(self):
        """Manager can update page content."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.manager_token.key}')
        res = self.client.patch('/api/v1/admin/cms/pages/about/', {
            'title': 'About Our Handloom Boutique',
            'last_updated_date': 'February 2024'
        }, format='json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['title'], 'About Our Handloom Boutique')
        self.assertEqual(res.json()['last_updated_date'], 'February 2024')
