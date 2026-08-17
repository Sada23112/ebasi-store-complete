from rest_framework import views, viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404

from admin_api.permissions import RequireStaffPermission
from admin_api.models import log_audit
from .models import StoreProfile, SocialLink, HeroSection, PageContent, MediaAsset
from .serializers import (
    StoreProfileSerializer,
    PublicStoreProfileSerializer,
    SocialLinkSerializer,
    HeroSectionSerializer,
    PublicHeroSectionSerializer,
    PageContentSerializer,
    PublicPageContentSerializer,
    MediaAssetSerializer,
    PublicCmsConfigSerializer,
)


# ==============================================================================
# Public CMS Views (Storefront Consumption)
# ==============================================================================

class PublicCmsConfigView(views.APIView):
    """
    Public unified endpoint returning active store profile, enabled social links,
    and homepage hero configuration in a single request.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        serializer = PublicCmsConfigSerializer(instance={}, context={'request': request})
        return Response(serializer.data)


class PublicPageContentView(views.APIView):
    """
    Public endpoint returning published page content for About Us, Privacy Policy,
    Terms of Service, and Contact page.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        page = get_object_or_404(PageContent, slug=slug, is_published=True)
        serializer = PublicPageContentSerializer(page, context={'request': request})
        return Response(serializer.data)


# ==============================================================================
# Admin CMS Views (Business Owner Management)
# ==============================================================================

class AdminStoreProfileView(views.APIView):
    """
    Admin endpoint to view and update store profile, contact details, address,
    and brand imagery.
    """
    permission_classes = [RequireStaffPermission]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    required_permission = 'content.view'

    def get_object(self):
        return StoreProfile.get_solo()

    def get(self, request):
        profile = self.get_object()
        serializer = StoreProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        if not request.user.has_perm('content.update') and not getattr(request.user, 'is_superuser', False):
            from admin_api.permissions import has_staff_permission
            if not has_staff_permission(request.user, 'content.update'):
                return Response(
                    {'error': 'Permission denied: Requires content.update permission.'},
                    status=status.HTTP_403_FORBIDDEN
                )

        profile = self.get_object()
        serializer = StoreProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            updated_profile = serializer.save()
            log_audit(
                request,
                action='content.store_update',
                target=updated_profile,
                target_repr=updated_profile.name,
                details={'phone': updated_profile.phone, 'address': updated_profile.address_city}
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminSocialLinkViewSet(viewsets.ModelViewSet):
    """
    Admin CRUD ViewSet for social media links.
    """
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer
    permission_classes = [RequireStaffPermission]
    action_permissions = {
        'list': 'content.view',
        'retrieve': 'content.view',
        'create': 'content.create',
        'update': 'content.update',
        'partial_update': 'content.update',
        'destroy': 'content.delete',
        'toggle_enabled': 'content.update',
    }

    def perform_create(self, serializer):
        link = serializer.save()
        log_audit(
            self.request,
            action='content.social_create',
            target=link,
            target_repr=link.platform,
            details={'url': link.url, 'is_enabled': link.is_enabled}
        )

    def perform_update(self, serializer):
        link = serializer.save()
        log_audit(
            self.request,
            action='content.social_update',
            target=link,
            target_repr=link.platform,
            details={'url': link.url, 'is_enabled': link.is_enabled}
        )

    def perform_destroy(self, instance):
        platform = instance.platform
        url = instance.url
        instance.delete()
        log_audit(
            self.request,
            action='content.social_delete',
            target=None,
            target_repr=platform,
            details={'url': url}
        )

    @action(detail=True, methods=['patch'], url_path='toggle-enabled')
    def toggle_enabled(self, request, pk=None):
        link = self.get_object()
        link.is_enabled = not link.is_enabled
        link.save(update_fields=['is_enabled', 'updated_at'])
        log_audit(
            request,
            action='content.social_toggle',
            target=link,
            target_repr=link.platform,
            details={'is_enabled': link.is_enabled}
        )
        return Response({'status': 'success', 'is_enabled': link.is_enabled})


class AdminHeroSectionView(views.APIView):
    """
    Admin endpoint to view and update homepage hero content and imagery.
    """
    permission_classes = [RequireStaffPermission]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    required_permission = 'content.view'

    def get_object(self):
        return HeroSection.get_solo()

    def get(self, request):
        hero = self.get_object()
        serializer = HeroSectionSerializer(hero, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        from admin_api.permissions import has_staff_permission
        if not has_staff_permission(request.user, 'content.update'):
            return Response(
                {'error': 'Permission denied: Requires content.update permission.'},
                status=status.HTTP_403_FORBIDDEN
            )

        hero = self.get_object()
        serializer = HeroSectionSerializer(hero, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            updated_hero = serializer.save()
            log_audit(
                request,
                action='content.hero_update',
                target=updated_hero,
                target_repr=updated_hero.heading,
                details={'heading': updated_hero.heading, 'is_active': updated_hero.is_active}
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        """Upload/replace hero image."""
        from admin_api.permissions import has_staff_permission
        if not has_staff_permission(request.user, 'content.update'):
            return Response(
                {'error': 'Permission denied: Requires content.update permission.'},
                status=status.HTTP_403_FORBIDDEN
            )

        hero = self.get_object()
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)

        hero.image = image_file
        if 'image_alt' in request.data:
            hero.image_alt = request.data['image_alt']
        hero.save()

        log_audit(
            request,
            action='content.hero_image_upload',
            target=hero,
            target_repr=hero.heading,
            details={'file_name': image_file.name}
        )
        serializer = HeroSectionSerializer(hero, context={'request': request})
        return Response(serializer.data)


class AdminPageContentViewSet(viewsets.ModelViewSet):
    """
    Admin ViewSet for public pages (About Us, Privacy Policy, Terms of Service, Contact).
    """
    queryset = PageContent.objects.all()
    serializer_class = PageContentSerializer
    permission_classes = [RequireStaffPermission]
    lookup_field = 'slug'
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    action_permissions = {
        'list': 'content.view',
        'retrieve': 'content.view',
        'create': 'content.create',
        'update': 'content.update',
        'partial_update': 'content.update',
        'destroy': 'content.delete',
        'upload_image': 'content.update',
    }

    def perform_update(self, serializer):
        page = serializer.save()
        log_audit(
            self.request,
            action='content.page_update',
            target=page,
            target_repr=page.get_slug_display(),
            details={'slug': page.slug, 'title': page.title, 'is_published': page.is_published}
        )

    @action(detail=True, methods=['post'], url_path='upload-image', parser_classes=[MultiPartParser, FormParser])
    def upload_image(self, request, slug=None):
        page = self.get_object()
        image_file = request.FILES.get('image')
        image_type = request.data.get('type', 'hero')  # 'hero' or 'story'

        if not image_file:
            return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)

        if image_type == 'story':
            page.story_image = image_file
        else:
            page.hero_image = image_file
        page.save()

        log_audit(
            request,
            action='content.page_image_upload',
            target=page,
            target_repr=page.get_slug_display(),
            details={'image_type': image_type, 'file_name': image_file.name}
        )
        serializer = PageContentSerializer(page, context={'request': request})
        return Response(serializer.data)


class AdminMediaAssetViewSet(viewsets.ModelViewSet):
    """
    Admin ViewSet for CMS & Brand Media Assets.
    """
    queryset = MediaAsset.objects.all()
    serializer_class = MediaAssetSerializer
    permission_classes = [RequireStaffPermission]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    action_permissions = {
        'list': 'content.view',
        'retrieve': 'content.view',
        'create': 'content.create',
        'update': 'content.update',
        'partial_update': 'content.update',
        'destroy': 'content.delete',
    }

    def perform_create(self, serializer):
        media = serializer.save()
        log_audit(
            self.request,
            action='content.media_upload',
            target=media,
            target_repr=media.title,
            details={'purpose': media.purpose}
        )

    def perform_destroy(self, instance):
        title = instance.title
        purpose = instance.purpose
        instance.delete()
        log_audit(
            self.request,
            action='content.media_delete',
            target=None,
            target_repr=title,
            details={'purpose': purpose}
        )
