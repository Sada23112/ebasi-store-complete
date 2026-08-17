from django.db import models
from django.core.validators import FileExtensionValidator


class StoreProfile(models.Model):
    """
    Singleton / Authoritative store profile and contact information for Ebasi Store.
    """
    name = models.CharField(max_length=200, default="Ms Ebasi Store")
    brand_name = models.CharField(max_length=200, default="EBASI STORE")
    enterprise_name = models.CharField(max_length=200, default="EBASI ENTERPRISE")
    business_type = models.CharField(max_length=200, default="Boutique / Clothing brand")
    tagline = models.CharField(max_length=300, default="Style that Speaks. Fashion that Lasts.")
    short_description = models.TextField(
        blank=True,
        default="Authentic Assamese traditional attire boutique. Specializing in handcrafted Deori Egu-Jokasiba, Mekhela Sador, Gamusa, and traditional silk weaves with direct WhatsApp customer assistance."
    )
    long_description = models.TextField(
        blank=True,
        default="Celebrating the timeless artistry of Assamese handlooms, Deori Egu-Jokasiba, and authentic ethnic wear directly from local weavers to your wardrobe."
    )

    # Contact Details
    phone = models.CharField(max_length=50, default="073992 91242")
    phone_raw = models.CharField(max_length=50, default="917399291242")
    phone_display = models.CharField(max_length=50, default="+91 73992 91242")
    whatsapp_number = models.CharField(max_length=50, default="917399291242")
    email = models.EmailField(blank=True, default="contact@ebasistore.com")

    # Location / Address
    address_street = models.CharField(max_length=255, default="Railway, Station Rd, opposite Parmananda Academy")
    address_locality = models.CharField(max_length=200, default="Nagakhelia No.2")
    address_city = models.CharField(max_length=100, default="Dhemaji")
    address_state = models.CharField(max_length=100, default="Assam")
    address_postal_code = models.CharField(max_length=20, default="787057")
    address_country = models.CharField(max_length=100, default="India")
    address_full = models.TextField(
        default="Railway, Station Rd, opposite Parmananda Academy, Nagakhelia No.2, Dhemaji, Assam 787057, India"
    )
    plus_code = models.CharField(max_length=100, default="FHG4+PH, Dhemaji, Assam")
    google_maps_embed_url = models.TextField(
        blank=True,
        default="https://maps.google.com/maps?q=Railway,+Station+Rd,+opposite+Parmananda+Academy,+Nagakhelia+No.2,+Dhemaji,+Assam+787057&t=&z=15&ie=UTF8&iwloc=&output=embed"
    )
    google_maps_directions_url = models.TextField(
        blank=True,
        default="https://www.google.com/maps/dir/?api=1&destination=Railway,+Station+Rd,+opposite+Parmananda+Academy,+Nagakhelia+No.2,+Dhemaji,+Assam+787057"
    )

    # Rich Details
    specialties = models.JSONField(
        default=list,
        blank=True,
        help_text="List of store specialties (e.g. Deori Egu-Jokasiba, Mekhela Sador, Gamusa)."
    )
    policies = models.JSONField(
        default=dict,
        blank=True,
        help_text="Store policies (e.g. payment terms, dispatch origin)."
    )

    # SEO & Metadata
    meta_title = models.CharField(
        max_length=200,
        default="Ms Ebasi Store | Authentic Assamese Traditional Attire & Handlooms"
    )
    meta_description = models.TextField(
        default="Discover authentic Assamese Mekhela Sador, Deori Egu-Jokasiba, Gamusa, and traditional handloom silk attire at Ms Ebasi Store, Dhemaji, Assam."
    )
    meta_keywords = models.CharField(
        max_length=500,
        blank=True,
        default="Assamese handloom, Mekhela Sador, Deori Egu-Jokasiba, Dhemaji boutique, Muga silk, Paat silk, Gamusa"
    )

    # Brand Assets
    logo_image = models.ImageField(
        upload_to='cms/brand/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp', 'svg', 'avif'])]
    )
    favicon_image = models.ImageField(
        upload_to='cms/brand/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp', 'ico', 'svg'])]
    )
    og_share_image = models.ImageField(
        upload_to='cms/brand/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp', 'avif'])]
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Store Profile'
        verbose_name_plural = 'Store Profile'

    def __str__(self):
        return f"{self.name} ({self.brand_name})"

    @classmethod
    def get_solo(cls):
        """Returns the primary StoreProfile instance or creates one with defaults."""
        obj, _ = cls.objects.get_or_create(id=1)
        return obj


class SocialLink(models.Model):
    """
    Editable social media handles and destinations.
    """
    PLATFORM_CHOICES = (
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('youtube', 'YouTube'),
        ('whatsapp', 'WhatsApp'),
        ('other', 'Other'),
    )

    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES, unique=True)
    display_name = models.CharField(max_length=100, blank=True)
    handle = models.CharField(max_length=100, blank=True)
    url = models.URLField(max_length=500)
    is_enabled = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'platform']
        verbose_name = 'Social Media Link'
        verbose_name_plural = 'Social Media Links'

    def __str__(self):
        return f"{self.get_platform_display()} ({self.handle or self.url})"


class HeroSection(models.Model):
    """
    Homepage Hero Banner Content and Media.
    """
    badge_text = models.CharField(max_length=100, default="New Season Arrivals")
    heading = models.CharField(max_length=200, default="Style that Speaks. Fashion that Lasts.")
    subheading = models.TextField(
        default="Discover the perfect blend of traditional elegance and modern style at EBASI STORE. Your destination for authentic Assamese Mekhela Sadors, sarees, and handcrafted fashion."
    )
    cta_text = models.CharField(max_length=100, default="Shop Collection")
    cta_link = models.CharField(max_length=255, default="/shop")
    secondary_cta_text = models.CharField(max_length=100, default="Follow Us")
    secondary_cta_link = models.CharField(max_length=255, default="https://www.instagram.com/ebasistore_traditionalattire/")

    image = models.ImageField(
        upload_to='cms/hero/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp', 'avif'])]
    )
    image_url_fallback = models.URLField(
        max_length=500,
        blank=True,
        default="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop"
    )
    image_alt = models.CharField(
        max_length=255,
        default="Authentic handcrafted Assamese Mekhela Sador and traditional boutique collection"
    )
    floating_card_title = models.CharField(max_length=200, default="Handcrafted Mekhela Sador")
    floating_card_subtitle = models.CharField(
        max_length=300,
        default="Explore our handpicked curation of elegant Assamese wear."
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Homepage Hero Section'
        verbose_name_plural = 'Homepage Hero Section'

    def __str__(self):
        return f"Hero Section: {self.heading[:40]}"

    @classmethod
    def get_solo(cls):
        obj, _ = cls.objects.get_or_create(id=1)
        return obj


class PageContent(models.Model):
    """
    Structured Public Page Content (About Us, Privacy Policy, Terms of Service, Contact).
    """
    PAGE_CHOICES = (
        ('about', 'About Us Page'),
        ('privacy-policy', 'Privacy Policy'),
        ('terms-of-service', 'Terms of Service'),
        ('contact', 'Contact Page'),
    )

    slug = models.SlugField(max_length=100, choices=PAGE_CHOICES, unique=True)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=300, blank=True)
    intro = models.TextField(blank=True)
    
    # Structured JSON content for rich sections (e.g. story, core values, policy articles)
    content_json = models.JSONField(
        default=dict,
        blank=True,
        help_text="Structured sections, articles, or values."
    )

    hero_image = models.ImageField(
        upload_to='cms/pages/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp', 'avif'])]
    )
    story_image = models.ImageField(
        upload_to='cms/pages/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp', 'avif'])]
    )

    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    last_updated_date = models.CharField(max_length=100, blank=True, default="January 15, 2024")
    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['slug']
        verbose_name = 'Page Content'
        verbose_name_plural = 'Page Contents'

    def __str__(self):
        return f"Page: {self.get_slug_display()}"


class MediaAsset(models.Model):
    """
    Reusable CMS and Brand Media Assets.
    """
    PURPOSE_CHOICES = (
        ('logo', 'Store Logo'),
        ('favicon', 'Favicon'),
        ('og_image', 'Social Share Image'),
        ('hero', 'Hero Banner'),
        ('about', 'About Page Media'),
        ('general', 'General Media'),
    )

    title = models.CharField(max_length=200)
    purpose = models.CharField(max_length=50, choices=PURPOSE_CHOICES, default='general')
    file = models.ImageField(
        upload_to='cms/media/',
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp', 'svg', 'ico', 'avif'])]
    )
    alt_text = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Media Asset'
        verbose_name_plural = 'Media Assets'

    def __str__(self):
        return f"{self.title} ({self.get_purpose_display()})"
