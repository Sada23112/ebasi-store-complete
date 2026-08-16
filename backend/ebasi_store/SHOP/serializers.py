from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVideo, Review, AnalyticsEvent
from django.db.models import Avg
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def get_complete_url(field_file, request=None):
    if not field_file:
        return None

    try:
        url = field_file.url
    except Exception as e:
        logger.error(f"ERROR: Failed to resolve URL for {field_file}: {e}")
        return None

    if url.startswith('http'):
        return url

    # If the URL is relative, but we have Cloudinary configured, construct the Cloudinary delivery URL
    cloud_name = getattr(settings, 'CLOUDINARY_CLOUD_NAME', None)
    if cloud_name and not settings.DEBUG:
        path = field_file.name
        if path.startswith('/'):
            path = path[1:]
        cloudinary_url = f"https://res.cloudinary.com/{cloud_name}/image/upload/{path}"
        logger.debug(f"Constructed Cloudinary fallback URL = {cloudinary_url}")
        return cloudinary_url

    if request:
        absolute_url = request.build_absolute_uri(url)
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
        # Fast list look up on prefetched images to eliminate N+1 queries.
        # Images are prefetched and sorted by (-is_primary, order), so first is primary.
        try:
            images = list(obj.images.all())
            if images:
                return get_complete_url(images[0].image, self.context.get('request'))
        except Exception as e:
            logger.error(f"Failed to resolve primary image: {e}")
        return None

    def get_average_rating(self, obj):
        # Use annotated rating if available
        avg = getattr(obj, 'annotated_avg_rating', None)
        if avg is None:
            avg = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0

    def get_review_count(self, obj):
        # Use annotated count if available
        count = getattr(obj, 'annotated_review_count', None)
        if count is None:
            count = obj.reviews.count()
        return count


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
        avg = getattr(obj, 'annotated_avg_rating', None)
        if avg is None:
            avg = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0

    def get_review_count(self, obj):
        count = getattr(obj, 'annotated_review_count', None)
        if count is None:
            count = obj.reviews.count()
        return count


class AnalyticsEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticsEvent
        fields = [
            'id',
            'event_type',
            'product',
            'product_name',
            'path',
            'search_query',
            'source',
            'session_id',
            'metadata',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        # Auto-fill product_name from product instance if not provided
        product = validated_data.get('product')
        if product and not validated_data.get('product_name'):
            validated_data['product_name'] = product.name
        return super().create(validated_data)
