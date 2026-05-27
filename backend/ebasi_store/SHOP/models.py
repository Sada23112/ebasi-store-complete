from django.db import models
from django.urls import reverse
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator

class Category(models.Model):
    name = models.CharField(
        max_length=100, unique=True,
        help_text="Category name displayed on the website"
    )
    slug = models.SlugField(
        max_length=100, unique=True,
        help_text="URL-friendly version of the name (auto-generated)"
    )
    description = models.TextField(
        blank=True,
        help_text="Brief description of what products belong in this category"
    )
    image = models.ImageField(
        upload_to='categories/', blank=True, null=True,
        help_text="Upload a category image (shown on the website's category section)"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Uncheck to hide this category from the website"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('category_detail', args=[self.slug])

class Product(models.Model):
    STOCK_STATUS = (
        ('in_stock', 'In Stock'),
        ('out_of_stock', 'Out of Stock'),
        ('limited_stock', 'Limited Stock'),
    )

    name = models.CharField(
        max_length=200,
        help_text="Enter the product name as it will appear on the website"
    )
    slug = models.SlugField(
        max_length=200, unique=True,
        help_text="URL-friendly version of the name (auto-generated)"
    )
    description = models.TextField(
        help_text="Full product description visible on the product page"
    )
    short_description = models.TextField(
        max_length=500, blank=True,
        help_text="Brief summary shown in product cards and search results"
    )
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='products',
        help_text="Choose which category this product belongs to"
    )
    price = models.DecimalField(
        max_digits=10, decimal_places=2,
        help_text="Current selling price in ₹ (INR)"
    )
    compare_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True,
        help_text="Original price before discount — leave blank if no sale"
    )
    sku = models.CharField(
        max_length=100, unique=True,
        help_text="Unique stock-keeping unit code for inventory tracking (e.g. EBASI-SAR-001)"
    )
    stock_quantity = models.PositiveIntegerField(
        default=0,
        help_text="Number of items currently available in stock"
    )
    stock_status = models.CharField(
        max_length=20, choices=STOCK_STATUS, default='in_stock',
        help_text="Current availability status shown to customers"
    )
    weight = models.DecimalField(
        max_digits=6, decimal_places=2, blank=True, null=True,
        help_text="Product weight in grams (used for shipping calculation)"
    )
    dimensions = models.CharField(
        max_length=100, blank=True,
        help_text="Product dimensions, e.g. '5.5m x 1.2m' for sarees"
    )
    is_featured = models.BooleanField(
        default=False,
        help_text="Featured products appear in the 'Featured' section on the homepage"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Turn off to hide this product from the website"
    )
    meta_title = models.CharField(
        max_length=200, blank=True,
        help_text="Custom page title for search engines (optional — uses product name if blank)"
    )
    meta_description = models.TextField(
        max_length=300, blank=True,
        help_text="Custom description for search engine results (optional)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('product_detail', args=[self.slug])

    @property
    def is_on_sale(self):
        return self.compare_price and self.compare_price > self.price

    @property
    def discount_percentage(self):
        if self.is_on_sale:
            return round(((self.compare_price - self.price) / self.compare_price) * 100)
        return 0

class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='images'
    )
    image = models.ImageField(
        upload_to='products/',
        help_text="Upload a clear, high-quality product photo"
    )
    alt_text = models.CharField(
        max_length=200, blank=True,
        help_text="Describe the image for accessibility and SEO (e.g. 'Red silk saree with gold border')"
    )
    is_primary = models.BooleanField(
        default=False,
        help_text="Check this to make it the main product image shown in listings"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order — lower numbers appear first"
    )

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.product.name} - Image {self.order}"


class ProductVideo(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='videos'
    )
    video = models.FileField(
        upload_to='products/videos/',
        validators=[FileExtensionValidator(allowed_extensions=['mp4', 'webm', 'ogg', 'mov'])],
        help_text="Upload a product video (MP4, WebM, OGG, or MOV format)"
    )
    thumbnail = models.ImageField(
        upload_to='products/videos/thumbnails/', blank=True, null=True,
        help_text="Optional thumbnail image shown before video plays"
    )
    title = models.CharField(
        max_length=200, blank=True,
        help_text="Video title (e.g. 'Product showcase' or 'How to drape')"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order — lower numbers appear first"
    )

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.product.name} - Video {self.order}"


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user_name = models.CharField(max_length=100, blank=True, default='')
    rating = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5),
        ]
    )
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        name = self.user_name or 'Anonymous'
        return f"{name} - {self.product.name} ({self.rating}★)"
