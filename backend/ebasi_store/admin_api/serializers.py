from rest_framework import serializers
from django.contrib.auth.models import User
from django.db.models import Avg, Count
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from SHOP.models import Category, Product, ProductImage, ProductVideo, Review, AnalyticsEvent
from accounts.models import ContactMessage, StaffProfile
from SHOP.serializers import get_complete_url
from .models import AuditLog
from .permissions import Roles, get_user_role, get_user_permissions


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


class StaffUserSerializer(serializers.ModelSerializer):
    """
    Comprehensive serializer for staff accounts.
    Never exposes password hashes or tokens.
    """
    role = serializers.SerializerMethodField()
    role_display = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    notes = serializers.SerializerMethodField()
    activity_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'role_display', 'permissions', 'phone', 'notes',
            'is_staff', 'is_superuser', 'is_active', 'date_joined', 'last_login',
            'activity_count'
        ]
        read_only_fields = ['date_joined', 'last_login', 'is_staff', 'is_superuser']

    def get_role(self, obj):
        return get_user_role(obj)

    def get_role_display(self, obj):
        role = get_user_role(obj)
        role_map = dict(Roles.CHOICES)
        return role_map.get(role, role.capitalize())

    def get_permissions(self, obj):
        return sorted(list(get_user_permissions(obj)))

    def get_phone(self, obj):
        profile = getattr(obj, 'staff_profile', None)
        return profile.phone if profile else ''

    def get_notes(self, obj):
        profile = getattr(obj, 'staff_profile', None)
        return profile.notes if profile else ''

    def get_activity_count(self, obj):
        return getattr(obj, 'audit_logs', None).count() if hasattr(obj, 'audit_logs') else 0


class StaffCreateSerializer(serializers.Serializer):
    """
    Serializer for creating new staff accounts with RBAC validation.
    """
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True, default='')
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True, default='')
    role = serializers.ChoiceField(choices=Roles.CHOICES, default=Roles.STAFF)
    is_active = serializers.BooleanField(default=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True, default='')
    notes = serializers.CharField(required=False, allow_blank=True, default='')

    def validate_username(self, value):
        username = value.strip()
        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return username

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return email

    def validate_password(self, value):
        try:
            validate_password(value)
        except Exception as e:
            raise serializers.ValidationError(list(e.messages) if hasattr(e, 'messages') else str(e))
        return value

    def create(self, validated_data):
        role = validated_data.get('role', Roles.STAFF)
        is_owner = (role == Roles.OWNER)

        with transaction.atomic():
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=validated_data.get('first_name', ''),
                last_name=validated_data.get('last_name', ''),
                is_staff=True,
                is_superuser=is_owner,
                is_active=validated_data.get('is_active', True)
            )

            StaffProfile.objects.create(
                user=user,
                role=role,
                phone=validated_data.get('phone', ''),
                notes=validated_data.get('notes', '')
            )

        return user


class StaffUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating basic staff details.
    """
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone', 'notes']

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return email

    def update(self, instance, validated_data):
        phone = validated_data.pop('phone', None)
        notes = validated_data.pop('notes', None)

        with transaction.atomic():
            for attr, val in validated_data.items():
                setattr(instance, attr, val)
            instance.save()

            profile, _ = StaffProfile.objects.get_or_create(user=instance)
            if phone is not None:
                profile.phone = phone
            if notes is not None:
                profile.notes = notes
            profile.save()

        return instance


class StaffRoleChangeSerializer(serializers.Serializer):
    """
    Serializer for updating a staff member's role.
    """
    role = serializers.ChoiceField(choices=Roles.CHOICES)


class StaffPasswordResetSerializer(serializers.Serializer):
    """
    Serializer for Owner resetting a staff member's password.
    """
    new_password = serializers.CharField(write_only=True, min_length=6)

    def validate_new_password(self, value):
        try:
            validate_password(value)
        except Exception as e:
            raise serializers.ValidationError(list(e.messages) if hasattr(e, 'messages') else str(e))
        return value


class AuditLogSerializer(serializers.ModelSerializer):
    """
    Serializer for business & staff audit logs.
    """
    class Meta:
        model = AuditLog
        fields = [
            'id', 'actor', 'actor_username', 'action',
            'target_type', 'target_id', 'target_repr',
            'details', 'ip_address', 'created_at'
        ]
        read_only_fields = fields


# Backward compatibility alias
AdminUserSerializer = StaffUserSerializer

