from rest_framework import serializers
from .models import StoreProfile, SocialLink, HeroSection, PageContent, MediaAsset


class StoreProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreProfile
        fields = [
            'id',
            'name',
            'brand_name',
            'enterprise_name',
            'business_type',
            'tagline',
            'short_description',
            'long_description',
            'phone',
            'phone_raw',
            'phone_display',
            'whatsapp_number',
            'email',
            'address_street',
            'address_locality',
            'address_city',
            'address_state',
            'address_postal_code',
            'address_country',
            'address_full',
            'plus_code',
            'google_maps_embed_url',
            'google_maps_directions_url',
            'specialties',
            'policies',
            'meta_title',
            'meta_description',
            'meta_keywords',
            'logo_image',
            'favicon_image',
            'og_share_image',
            'updated_at',
        ]
        read_only_fields = ['id', 'updated_at']


class PublicStoreProfileSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    favicon_url = serializers.SerializerMethodField()
    og_share_image_url = serializers.SerializerMethodField()

    class Meta:
        model = StoreProfile
        fields = [
            'name',
            'brand_name',
            'enterprise_name',
            'business_type',
            'tagline',
            'short_description',
            'long_description',
            'phone',
            'phone_raw',
            'phone_display',
            'whatsapp_number',
            'email',
            'address_street',
            'address_locality',
            'address_city',
            'address_state',
            'address_postal_code',
            'address_country',
            'address_full',
            'plus_code',
            'google_maps_embed_url',
            'google_maps_directions_url',
            'specialties',
            'policies',
            'meta_title',
            'meta_description',
            'meta_keywords',
            'logo_url',
            'favicon_url',
            'og_share_image_url',
        ]

    def get_logo_url(self, obj):
        if obj.logo_image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.logo_image.url) if request else obj.logo_image.url
        return None

    def get_favicon_url(self, obj):
        if obj.favicon_image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.favicon_image.url) if request else obj.favicon_image.url
        return None

    def get_og_share_image_url(self, obj):
        if obj.og_share_image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.og_share_image.url) if request else obj.og_share_image.url
        return None


class SocialLinkSerializer(serializers.ModelSerializer):
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)

    class Meta:
        model = SocialLink
        fields = [
            'id',
            'platform',
            'platform_display',
            'display_name',
            'handle',
            'url',
            'is_enabled',
            'order',
            'updated_at',
        ]
        read_only_fields = ['id', 'updated_at']

    def validate_url(self, value):
        if not value or not (value.startswith('http://') or value.startswith('https://')):
            raise serializers.ValidationError("Social URL must begin with http:// or https://")
        return value.strip()


class HeroSectionSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = HeroSection
        fields = [
            'id',
            'badge_text',
            'heading',
            'subheading',
            'cta_text',
            'cta_link',
            'secondary_cta_text',
            'secondary_cta_link',
            'image',
            'image_url',
            'image_url_fallback',
            'image_alt',
            'floating_card_title',
            'floating_card_subtitle',
            'is_active',
            'updated_at',
        ]
        read_only_fields = ['id', 'updated_at']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return obj.image_url_fallback or None


class PublicHeroSectionSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = HeroSection
        fields = [
            'badge_text',
            'heading',
            'subheading',
            'cta_text',
            'cta_link',
            'secondary_cta_text',
            'secondary_cta_link',
            'image_url',
            'image_alt',
            'floating_card_title',
            'floating_card_subtitle',
            'is_active',
        ]

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return obj.image_url_fallback or None


class PageContentSerializer(serializers.ModelSerializer):
    hero_image_url = serializers.SerializerMethodField()
    story_image_url = serializers.SerializerMethodField()
    page_name = serializers.CharField(source='get_slug_display', read_only=True)

    class Meta:
        model = PageContent
        fields = [
            'id',
            'slug',
            'page_name',
            'title',
            'subtitle',
            'intro',
            'content_json',
            'hero_image',
            'hero_image_url',
            'story_image',
            'story_image_url',
            'meta_title',
            'meta_description',
            'last_updated_date',
            'is_published',
            'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'updated_at']

    def get_hero_image_url(self, obj):
        if obj.hero_image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.hero_image.url) if request else obj.hero_image.url
        return None

    def get_story_image_url(self, obj):
        if obj.story_image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.story_image.url) if request else obj.story_image.url
        return None


class PublicPageContentSerializer(serializers.ModelSerializer):
    hero_image_url = serializers.SerializerMethodField()
    story_image_url = serializers.SerializerMethodField()

    class Meta:
        model = PageContent
        fields = [
            'slug',
            'title',
            'subtitle',
            'intro',
            'content_json',
            'hero_image_url',
            'story_image_url',
            'meta_title',
            'meta_description',
            'last_updated_date',
        ]

    def get_hero_image_url(self, obj):
        if obj.hero_image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.hero_image.url) if request else obj.hero_image.url
        return None

    def get_story_image_url(self, obj):
        if obj.story_image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.story_image.url) if request else obj.story_image.url
        return None


class MediaAssetSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    purpose_display = serializers.CharField(source='get_purpose_display', read_only=True)

    class Meta:
        model = MediaAsset
        fields = [
            'id',
            'title',
            'purpose',
            'purpose_display',
            'file',
            'file_url',
            'alt_text',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.file.url) if request else obj.file.url
        return None


class PublicCmsConfigSerializer(serializers.Serializer):
    store = serializers.SerializerMethodField()
    social_links = serializers.SerializerMethodField()
    hero = serializers.SerializerMethodField()

    def get_store(self, obj):
        profile = StoreProfile.get_solo()
        return PublicStoreProfileSerializer(profile, context=self.context).data

    def get_social_links(self, obj):
        links = SocialLink.objects.filter(is_enabled=True)
        return SocialLinkSerializer(links, many=True, context=self.context).data

    def get_hero(self, obj):
        hero = HeroSection.get_solo()
        return PublicHeroSectionSerializer(hero, context=self.context).data
