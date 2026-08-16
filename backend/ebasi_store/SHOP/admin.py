from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, ProductImage, ProductVideo, Review, AnalyticsEvent


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 80px; max-width: 80px; object-fit: cover; border-radius: 4px;" />', obj.image.url)
        return "No image"
    image_preview.short_description = 'Preview'


class ProductVideoInline(admin.TabularInline):
    model = ProductVideo
    extra = 0
    readonly_fields = ['video_preview']
    fields = ['video', 'thumbnail', 'title', 'order', 'video_preview']

    def video_preview(self, obj):
        if obj.video:
            return format_html(
                '<video width="120" height="80" controls style="border-radius: 4px;">'
                '<source src="{}" type="video/mp4">Your browser does not support video.</video>',
                obj.video.url
            )
        return "No video"
    video_preview.short_description = 'Preview'


class ReviewInline(admin.TabularInline):
    model = Review
    extra = 0
    readonly_fields = ['user_name', 'rating', 'comment', 'created_at']
    can_delete = True


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock_status', 'stock_quantity', 'badge', 'is_featured', 'primary_image_preview', 'media_count', 'created_at']
    list_filter = ['category', 'stock_status', 'badge', 'is_featured', 'is_active', 'created_at']
    search_fields = ['name', 'description', 'sku']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline, ProductVideoInline, ReviewInline]
    list_per_page = 20

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'short_description', 'category')
        }),
        ('Pricing', {
            'fields': ('price', 'compare_price')
        }),
        ('Inventory', {
            'fields': ('sku', 'stock_quantity', 'stock_status')
        }),
        ('Physical', {
            'fields': ('weight', 'dimensions'),
            'classes': ('collapse',),
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',),
        }),
        ('Status', {
            'fields': ('is_featured', 'is_active', 'badge')
        }),
    )

    def primary_image_preview(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if not primary:
            primary = obj.images.first()
        if primary and primary.image:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 50px; object-fit: cover; border-radius: 4px;" />', primary.image.url)
        return "No image"
    primary_image_preview.short_description = 'Image'

    def media_count(self, obj):
        imgs = obj.images.count()
        vids = obj.videos.count()
        return f"{imgs} img, {vids} vid"
    media_count.short_description = 'Media'


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'alt_text', 'is_primary', 'order', 'image_preview']
    list_filter = ['is_primary', 'product']

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 80px; max-width: 80px; object-fit: cover; border-radius: 4px;" />', obj.image.url)
        return "No image"
    image_preview.short_description = 'Preview'


@admin.register(ProductVideo)
class ProductVideoAdmin(admin.ModelAdmin):
    list_display = ['product', 'title', 'order', 'video_preview']
    list_filter = ['product']
    search_fields = ['title', 'product__name']

    def video_preview(self, obj):
        if obj.video:
            return format_html(
                '<video width="120" height="80" controls style="border-radius: 4px;">'
                '<source src="{}" type="video/mp4">Your browser does not support video.</video>',
                obj.video.url
            )
        return "No video"
    video_preview.short_description = 'Preview'


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'product', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['user_name', 'comment', 'product__name']
    readonly_fields = ['created_at']

    def display_name(self, obj):
        return obj.user_name or 'Anonymous'
    display_name.short_description = 'Reviewer'


@admin.register(AnalyticsEvent)
class AnalyticsEventAdmin(admin.ModelAdmin):
    list_display = [
        'event_type_badge',
        'display_target',
        'path',
        'source',
        'session_id_short',
        'created_at',
    ]
    list_filter = ['event_type', 'source', 'created_at']
    search_fields = ['path', 'search_query', 'product_name', 'product__name', 'source', 'session_id']
    date_hierarchy = 'created_at'
    readonly_fields = [
        'event_type',
        'product',
        'product_name',
        'path',
        'search_query',
        'source',
        'session_id',
        'metadata_formatted',
        'created_at',
    ]
    fields = [
        'event_type',
        'created_at',
        'product',
        'product_name',
        'path',
        'search_query',
        'source',
        'session_id',
        'metadata_formatted',
    ]
    list_per_page = 50

    def has_add_permission(self, request):
        return False

    def event_type_badge(self, obj):
        colors = {
            'whatsapp_click': '#16a34a',
            'product_view': '#2563eb',
            'search': '#9333ea',
            'wishlist_add': '#e11d48',
            'page_view': '#64748b',
            'contact_submit': '#d97706',
        }
        color = colors.get(obj.event_type, '#64748b')
        return format_html(
            '<span style="background-color: {}; color: #fff; padding: 3px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase;">{}</span>',
            color,
            obj.get_event_type_display()
        )
    event_type_badge.short_description = 'Event Type'

    def display_target(self, obj):
        if obj.product:
            return format_html('<a href="{}">{}</a>', obj.product.get_absolute_url(), obj.product_name or obj.product.name)
        if obj.product_name:
            return obj.product_name
        if obj.search_query:
            return format_html('Query: <em>"{}"</em>', obj.search_query)
        return "-"
    display_target.short_description = 'Product / Query'

    def session_id_short(self, obj):
        if not obj.session_id:
            return "-"
        return obj.session_id[:10] + "..." if len(obj.session_id) > 10 else obj.session_id
    session_id_short.short_description = 'Session'

    def metadata_formatted(self, obj):
        if not obj.metadata:
            return "No additional metadata"
        import json
        return format_html('<pre style="background: #f8fafc; padding: 10px; border-radius: 6px; font-size: 12px;">{}</pre>', json.dumps(obj.metadata, indent=2))
    metadata_formatted.short_description = 'Event Metadata'


# Unregister technical framework models from Django Admin interface for store owner cleanliness
from django.contrib.auth.models import Group
from django.contrib.sites.models import Site
from rest_framework.authtoken.models import TokenProxy
from allauth.account.models import EmailAddress
from allauth.socialaccount.models import SocialApp, SocialToken, SocialAccount

for technical_model in [Group, Site, TokenProxy, EmailAddress, SocialApp, SocialToken, SocialAccount]:
    try:
        admin.site.unregister(technical_model)
    except admin.sites.NotRegistered:
        pass

