from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVideo, Review
from django.db.models import Avg
from django.conf import settings


def get_complete_url(field_file, request=None):
    if not field_file:
        return None

    try:
        url = field_file.url
    except Exception as e:
        print(f"ERROR: Failed to resolve URL for {field_file}: {e}", flush=True)
        return None

    # Print the raw image URL for debugging to Render's service logs
    print(f"DEBUG: field_file.name = {field_file.name}, field_file.url = {url}", flush=True)

    if url.startswith('http'):
        return url

    # If the URL is relative, but we have Cloudinary configured, construct the Cloudinary delivery URL
    cloud_name = getattr(settings, 'CLOUDINARY_CLOUD_NAME', None)
    if cloud_name and not settings.DEBUG:
        path = field_file.name
        if path.startswith('/'):
            path = path[1:]
        cloudinary_url = f"https://res.cloudinary.com/{cloud_name}/image/upload/{path}"
        print(f"DEBUG: Constructed Cloudinary fallback URL = {cloudinary_url}", flush=True)
        return cloudinary_url

    if request:
        absolute_url = request.build_absolute_uri(url)
        print(f"DEBUG: Absolute Django URL = {absolute_url}", flush=True)
        return absolute_url

    return url


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']

    def get_image(self, obj):
        return get_complete_url(obj.image, self.context.get('request'))


class ProductVideoSerializer(serializers.ModelSerializer):
    video = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = ProductVideo
        fields = ['id', 'video', 'thumbnail', 'title', 'order']

    def get_video(self, obj):
        return get_complete_url(obj.video, self.context.get('request'))

    def get_thumbnail(self, obj):
        return get_complete_url(obj.thumbnail, self.context.get('request'))


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'is_active']

    def get_image(self, obj):
        return get_complete_url(obj.image, self.context.get('request'))


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'product', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'product', 'created_at']


class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'short_description', 'category',
            'price', 'compare_price', 'is_on_sale', 'discount_percentage',
            'stock_status', 'is_featured', 'badge', 'primary_image',
            'average_rating', 'review_count'
        ]

    def get_primary_image(self, obj):
        # First try to get the image explicitly marked as primary
        primary_image = obj.images.filter(is_primary=True).first()
        # Fall back to the first available image if none is marked primary
        if not primary_image:
            primary_image = obj.images.first()
        if primary_image:
            return get_complete_url(primary_image.image, self.context.get('request'))
        return None

    def get_average_rating(self, obj):
        avg = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0

    def get_review_count(self, obj):
        return obj.reviews.count()


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    videos = ProductVideoSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'short_description',
            'category', 'price', 'compare_price', 'is_on_sale',
            'discount_percentage', 'sku', 'stock_quantity', 'stock_status',
            'weight', 'dimensions', 'is_featured', 'badge', 'meta_title',
            'meta_description', 'images', 'videos', 'reviews', 'average_rating',
            'review_count', 'created_at', 'updated_at'
        ]

    def get_average_rating(self, obj):
        avg = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0

    def get_review_count(self, obj):
        return obj.reviews.count()
