from rest_framework import serializers
from django.contrib.auth.models import User
from django.db.models import Avg, Count
from SHOP.models import Category, Product, ProductImage, ProductVideo, Review, AnalyticsEvent
from accounts.models import ContactMessage
from SHOP.serializers import get_complete_url


class AdminProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url', 'alt_text', 'is_primary', 'order']
        extra_kwargs = {
            'image': {'required': False, 'allow_null': True}
        }

    def get_image_url(self, obj):
        return get_complete_url(obj.image, self.context.get('request'))


class AdminProductVideoSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductVideo
        fields = ['id', 'video', 'video_url', 'thumbnail', 'thumbnail_url', 'title', 'order']
        extra_kwargs = {
            'video': {'required': False, 'allow_null': True},
            'thumbnail': {'required': False, 'allow_null': True}
        }

    def get_video_url(self, obj):
        return get_complete_url(obj.video, self.context.get('request'))

    def get_thumbnail_url(self, obj):
        return get_complete_url(obj.thumbnail, self.context.get('request'))


class AdminCategorySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    products_count = serializers.IntegerField(read_only=True, default=0)
    active_products_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'image', 'image_url',
            'is_active', 'products_count', 'active_products_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
        extra_kwargs = {
            'image': {'required': False, 'allow_null': True},
            'slug': {'required': False},
            'description': {'required': False, 'allow_blank': True}
        }

    def get_image_url(self, obj):
        return get_complete_url(obj.image, self.context.get('request'))

    def validate(self, attrs):
        from django.utils.text import slugify
        import uuid
        if not attrs.get('slug'):
            name = attrs.get('name') or (self.instance.name if self.instance else '')
            attrs['slug'] = slugify(name) or f"cat-{uuid.uuid4().hex[:6]}"
        return attrs


class AdminProductSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    category = AdminCategorySerializer(read_only=True)
    images = AdminProductImageSerializer(many=True, read_only=True)
    videos = AdminProductVideoSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    is_on_sale = serializers.BooleanField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    views_count = serializers.SerializerMethodField()
    wishlist_count = serializers.SerializerMethodField()
    whatsapp_clicks_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'short_description',
            'category_id', 'category', 'price', 'compare_price', 'is_on_sale',
            'discount_percentage', 'sku', 'stock_quantity', 'stock_status',
            'weight', 'dimensions', 'is_featured', 'is_active', 'badge',
            'meta_title', 'meta_description', 'images', 'videos',
            'primary_image', 'average_rating', 'review_count',
            'views_count', 'wishlist_count', 'whatsapp_clicks_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
        extra_kwargs = {
            'slug': {'required': False},
            'sku': {'required': False},
            'short_description': {'required': False, 'allow_blank': True},
            'description': {'required': False, 'allow_blank': True},
            'dimensions': {'required': False, 'allow_blank': True},
            'meta_title': {'required': False, 'allow_blank': True},
            'meta_description': {'required': False, 'allow_blank': True},
        }

    def get_primary_image(self, obj):
        try:
            images = list(obj.images.all())
            if images:
                primary = next((img for img in images if img.is_primary), images[0])
                return get_complete_url(primary.image, self.context.get('request'))
        except Exception:
            pass
        return None

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

    def get_views_count(self, obj):
        return getattr(obj, 'annotated_views_count', None) or obj.analytics_events.filter(event_type='product_view').count()

    def get_wishlist_count(self, obj):
        return getattr(obj, 'annotated_wishlist_count', None) or obj.wishlisted_by.count()

    def get_whatsapp_clicks_count(self, obj):
        return getattr(obj, 'annotated_whatsapp_count', None) or obj.analytics_events.filter(event_type='whatsapp_click').count()

    def validate(self, attrs):
        from django.utils.text import slugify
        import uuid
        if not attrs.get('slug'):
            name = attrs.get('name') or (self.instance.name if self.instance else '')
            attrs['slug'] = slugify(name) or f"prod-{uuid.uuid4().hex[:6]}"
        if not attrs.get('sku') and not self.instance:
            attrs['sku'] = f"EBA-{uuid.uuid4().hex[:6].upper()}"
        return attrs


class AdminReviewSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_slug = serializers.CharField(source='product.slug', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'product_id', 'product_name', 'product_slug',
            'user_name', 'rating', 'comment', 'created_at'
        ]
        read_only_fields = ['created_at']


class AdminContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            'id', 'name', 'email', 'phone', 'subject', 'message',
            'is_read', 'created_at'
        ]
        read_only_fields = ['created_at']


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'is_staff', 'is_superuser', 'is_active', 'date_joined', 'last_login'
        ]
        read_only_fields = ['date_joined', 'last_login']
