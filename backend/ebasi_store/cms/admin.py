from django.contrib import admin
from .models import StoreProfile, SocialLink, HeroSection, PageContent, MediaAsset


@admin.register(StoreProfile)
class StoreProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'brand_name', 'phone_display', 'whatsapp_number', 'address_city', 'updated_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ['platform', 'handle', 'url', 'is_enabled', 'order', 'updated_at']
    list_filter = ['platform', 'is_enabled']
    list_editable = ['is_enabled', 'order']


@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    list_display = ['heading', 'badge_text', 'cta_text', 'is_active', 'updated_at']
    list_editable = ['is_active']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(PageContent)
class PageContentAdmin(admin.ModelAdmin):
    list_display = ['slug', 'title', 'last_updated_date', 'is_published', 'updated_at']
    list_filter = ['is_published']
    list_editable = ['is_published']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ['title', 'purpose', 'created_at', 'updated_at']
    list_filter = ['purpose']
    search_fields = ['title', 'alt_text']
