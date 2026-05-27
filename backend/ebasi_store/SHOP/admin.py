from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, ProductImage, ProductVideo, Review


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ['image_preview']
    fields = ['image', 'image_preview', 'alt_text', 'is_primary', 'order']

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 80px; max-width: 80px; object-fit: cover; '
                'border-radius: 8px; border: 2px solid #F3F4F6; box-shadow: 0 1px 3px rgba(0,0,0,0.08);" />',
                obj.image.url
            )
        return format_html('<span style="color: #9CA3AF; font-size: 0.8125rem;">No image uploaded</span>')
    image_preview.short_description = 'Preview'


class ProductVideoInline(admin.TabularInline):
    model = ProductVideo
    extra = 0
    readonly_fields = ['video_preview']
    fields = ['video', 'thumbnail', 'title', 'order', 'video_preview']

    def video_preview(self, obj):
        if obj.video:
            return format_html(
                '<video width="140" height="90" controls style="border-radius: 8px; border: 2px solid #F3F4F6;">'
                '<source src="{}" type="video/mp4">Your browser does not support video.</video>',
                obj.video.url
            )
        return format_html('<span style="color: #9CA3AF; font-size: 0.8125rem;">No video uploaded</span>')
    video_preview.short_description = 'Preview'


class ReviewInline(admin.TabularInline):
    model = Review
    extra = 0
    readonly_fields = ['user_name', 'rating_display', 'comment', 'created_at']
    fields = ['user_name', 'rating_display', 'comment', 'created_at']
    can_delete = True

    def rating_display(self, obj):
        """Show star rating visually."""
        stars = '★' * obj.rating + '☆' * (5 - obj.rating)
        color = '#DB2777' if obj.rating >= 4 else '#D97706' if obj.rating >= 3 else '#DC2626'
        return format_html(
            '<span style="color: {}; font-size: 1rem; letter-spacing: 2px;">{}</span>',
            color, stars
        )
    rating_display.short_description = 'Rating'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'category_image_preview', 'is_active', 'product_count', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_per_page = 20

    def category_image_preview(self, obj):
        """Show a small thumbnail of the category image in the list view."""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 40px; max-width: 40px; object-fit: cover; '
                'border-radius: 6px; border: 1px solid #E5E7EB;" />',
                obj.image.url
            )
        return format_html('<span style="color: #9CA3AF; font-size: 0.75rem;">—</span>')
    category_image_preview.short_description = 'Image'

    def product_count(self, obj):
        """Show how many products are in this category."""
        count = obj.products.count()
        return format_html(
            '<span style="background: #FDF2F8; color: #9D174D; padding: 2px 10px; '
            'border-radius: 100px; font-size: 0.75rem; font-weight: 600;">{}</span>',
            count
        )
    product_count.short_description = 'Products'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'category', 'formatted_price', 'stock_status_badge',
        'stock_quantity', 'is_featured', 'primary_image_preview',
        'media_count', 'created_at'
    ]
    list_filter = ['category', 'stock_status', 'is_featured', 'is_active', 'created_at']
    search_fields = ['name', 'description', 'sku']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline, ProductVideoInline, ReviewInline]
    list_per_page = 20
    save_on_top = True
    list_editable = ['is_featured']

    fieldsets = (
        ('📦 Basic Information', {
            'fields': ('name', 'slug', 'description', 'short_description', 'category'),
            'description': 'Core product details that appear on the website.',
        }),
        ('💰 Pricing', {
            'fields': ('price', 'compare_price'),
            'description': 'Set the current selling price. Add a compare price to show a sale discount.',
        }),
        ('📊 Inventory', {
            'fields': ('sku', 'stock_quantity', 'stock_status'),
            'description': 'Track stock levels and availability.',
        }),
        ('📐 Physical Details', {
            'fields': ('weight', 'dimensions'),
            'classes': ('collapse',),
            'description': 'Optional — used for shipping calculations.',
        }),
        ('🔍 SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',),
            'description': 'Optional — customize how this product appears in search engine results.',
        }),
        ('👁️ Visibility', {
            'fields': ('is_featured', 'is_active'),
            'description': 'Control where and whether this product appears on the website.',
        }),
    )

    def primary_image_preview(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if not primary:
            primary = obj.images.first()
        if primary and primary.image:
            return format_html(
                '<img src="{}" style="max-height: 50px; max-width: 50px; object-fit: cover; '
                'border-radius: 8px; border: 2px solid #F3F4F6; box-shadow: 0 1px 3px rgba(0,0,0,0.06);" />',
                primary.image.url
            )
        return format_html('<span style="color: #9CA3AF; font-size: 0.75rem;">—</span>')
    primary_image_preview.short_description = 'Image'

    def media_count(self, obj):
        imgs = obj.images.count()
        vids = obj.videos.count()
        parts = []
        if imgs:
            parts.append(f'{imgs} img')
        if vids:
            parts.append(f'{vids} vid')
        return ', '.join(parts) if parts else '—'
    media_count.short_description = 'Media'

    def formatted_price(self, obj):
        """Display price with currency symbol and sale indicator."""
        if obj.is_on_sale:
            return format_html(
                '<span style="font-weight: 600; color: #059669;">₹{}</span> '
                '<span style="text-decoration: line-through; color: #9CA3AF; font-size: 0.75rem;">₹{}</span>',
                obj.price, obj.compare_price
            )
        return format_html('<span style="font-weight: 600;">₹{}</span>', obj.price)
    formatted_price.short_description = 'Price'
    formatted_price.admin_order_field = 'price'

    def stock_status_badge(self, obj):
        """Show stock status as a colored badge."""
        colors = {
            'in_stock': ('#059669', '#ECFDF5', 'In Stock'),
            'out_of_stock': ('#DC2626', '#FEF2F2', 'Out of Stock'),
            'limited_stock': ('#D97706', '#FFFBEB', 'Limited'),
        }
        text_color, bg_color, label = colors.get(obj.stock_status, ('#6B7280', '#F3F4F6', obj.stock_status))
        return format_html(
            '<span style="background: {}; color: {}; padding: 3px 10px; border-radius: 100px; '
            'font-size: 0.6875rem; font-weight: 600; white-space: nowrap;">{}</span>',
            bg_color, text_color, label
        )
    stock_status_badge.short_description = 'Status'
    stock_status_badge.admin_order_field = 'stock_status'


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'alt_text', 'is_primary', 'order', 'image_preview']
    list_filter = ['is_primary', 'product']
    list_per_page = 20

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 80px; max-width: 80px; object-fit: cover; '
                'border-radius: 8px; border: 2px solid #F3F4F6; box-shadow: 0 1px 3px rgba(0,0,0,0.08);" />',
                obj.image.url
            )
        return format_html('<span style="color: #9CA3AF;">No image</span>')
    image_preview.short_description = 'Preview'


@admin.register(ProductVideo)
class ProductVideoAdmin(admin.ModelAdmin):
    list_display = ['product', 'title', 'order', 'video_preview']
    list_filter = ['product']
    search_fields = ['title', 'product__name']
    list_per_page = 20

    def video_preview(self, obj):
        if obj.video:
            return format_html(
                '<video width="140" height="90" controls style="border-radius: 8px; border: 2px solid #F3F4F6;">'
                '<source src="{}" type="video/mp4">Your browser does not support video.</video>',
                obj.video.url
            )
        return format_html('<span style="color: #9CA3AF;">No video</span>')
    video_preview.short_description = 'Preview'


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'product', 'rating_display', 'short_comment', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['user_name', 'comment', 'product__name']
    readonly_fields = ['created_at']
    list_per_page = 20

    def display_name(self, obj):
        return obj.user_name or 'Anonymous'
    display_name.short_description = 'Reviewer'

    def rating_display(self, obj):
        """Show star rating visually."""
        stars = '★' * obj.rating + '☆' * (5 - obj.rating)
        color = '#DB2777' if obj.rating >= 4 else '#D97706' if obj.rating >= 3 else '#DC2626'
        return format_html(
            '<span style="color: {}; letter-spacing: 1px;">{}</span>',
            color, stars
        )
    rating_display.short_description = 'Rating'

    def short_comment(self, obj):
        """Truncated comment for list view."""
        if len(obj.comment) > 80:
            return obj.comment[:80] + '…'
        return obj.comment
    short_comment.short_description = 'Comment'
