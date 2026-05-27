from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, ProductImage, ProductVideo, Review


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
    list_display = ['name', 'category', 'price', 'stock_status', 'stock_quantity', 'is_featured', 'primary_image_preview', 'media_count', 'created_at']
    list_filter = ['category', 'stock_status', 'is_featured', 'is_active', 'created_at']
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
            'fields': ('is_featured', 'is_active')
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
