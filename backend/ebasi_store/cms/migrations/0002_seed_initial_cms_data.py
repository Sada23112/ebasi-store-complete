from django.db import migrations


def seed_cms_data(apps, schema_editor):
    StoreProfile = apps.get_model('cms', 'StoreProfile')
    SocialLink = apps.get_model('cms', 'SocialLink')
    HeroSection = apps.get_model('cms', 'HeroSection')
    PageContent = apps.get_model('cms', 'PageContent')

    # 1. StoreProfile
    StoreProfile.objects.get_or_create(
        id=1,
        defaults={
            'name': 'Ms Ebasi Store',
            'brand_name': 'EBASI STORE',
            'enterprise_name': 'EBASI ENTERPRISE',
            'business_type': 'Boutique / Clothing brand',
            'tagline': 'Style that Speaks. Fashion that Lasts.',
            'short_description': 'Authentic Assamese traditional attire boutique. Specializing in handcrafted Deori Egu-Jokasiba, Mekhela Sador, Gamusa, and traditional silk weaves with direct WhatsApp customer assistance.',
            'long_description': 'Celebrating the timeless artistry of Assamese handlooms, Deori Egu-Jokasiba, and authentic ethnic wear directly from local weavers to your wardrobe.',
            'phone': '073992 91242',
            'phone_raw': '917399291242',
            'phone_display': '+91 73992 91242',
            'whatsapp_number': '917399291242',
            'email': 'contact@ebasistore.com',
            'address_street': 'Railway, Station Rd, opposite Parmananda Academy',
            'address_locality': 'Nagakhelia No.2',
            'address_city': 'Dhemaji',
            'address_state': 'Assam',
            'address_postal_code': '787057',
            'address_country': 'India',
            'address_full': 'Railway, Station Rd, opposite Parmananda Academy, Nagakhelia No.2, Dhemaji, Assam 787057, India',
            'plus_code': 'FHG4+PH, Dhemaji, Assam',
            'google_maps_embed_url': 'https://maps.google.com/maps?q=Railway,+Station+Rd,+opposite+Parmananda+Academy,+Nagakhelia+No.2,+Dhemaji,+Assam+787057&t=&z=15&ie=UTF8&iwloc=&output=embed',
            'google_maps_directions_url': 'https://www.google.com/maps/dir/?api=1&destination=Railway,+Station+Rd,+opposite+Parmananda+Academy,+Nagakhelia+No.2,+Dhemaji,+Assam+787057',
            'specialties': [
                'Deori Egu-Jokasiba',
                'Mekhela Sador',
                'Traditional Sarees',
                'Gamusa',
                'Handloom Silk & Cotton',
            ],
            'policies': {
                'payment': 'Prepaid via UPI / Direct WhatsApp Order (No COD)',
                'dispatch': 'Dispatched directly from Dhemaji, Assam',
            },
            'meta_title': 'Ms Ebasi Store | Authentic Assamese Traditional Attire & Handlooms',
            'meta_description': 'Discover authentic Assamese Mekhela Sador, Deori Egu-Jokasiba, Gamusa, and traditional handloom silk attire at Ms Ebasi Store, Dhemaji, Assam.',
            'meta_keywords': 'Assamese handloom, Mekhela Sador, Deori Egu-Jokasiba, Dhemaji boutique, Muga silk, Paat silk, Gamusa',
        }
    )

    # 2. Social Links
    social_defaults = [
        {
            'platform': 'instagram',
            'display_name': 'Instagram',
            'handle': '@ebasistore_traditionalattire',
            'url': 'https://www.instagram.com/ebasistore_traditionalattire/',
            'is_enabled': True,
            'order': 1,
        },
        {
            'platform': 'youtube',
            'display_name': 'YouTube Channel',
            'handle': 'Ms Ebasi Store',
            'url': 'https://www.youtube.com/channel/UCjcFLd3hbc2uexKAQxh7wyQ',
            'is_enabled': True,
            'order': 2,
        },
        {
            'platform': 'facebook',
            'display_name': 'Facebook Page',
            'handle': 'Twinkle Deori (Ebasi Store)',
            'url': 'https://www.facebook.com/twinkledeori21/#',
            'is_enabled': True,
            'order': 3,
        },
        {
            'platform': 'whatsapp',
            'display_name': 'WhatsApp Order Support',
            'handle': '+91 73992 91242',
            'url': 'https://wa.me/917399291242',
            'is_enabled': True,
            'order': 4,
        },
    ]
    for s in social_defaults:
        SocialLink.objects.get_or_create(platform=s['platform'], defaults=s)

    # 3. Hero Section
    HeroSection.objects.get_or_create(
        id=1,
        defaults={
            'badge_text': 'New Season Arrivals',
            'heading': 'Style that Speaks. Fashion that Lasts.',
            'subheading': 'Discover the perfect blend of traditional elegance and modern style at EBASI STORE. Your destination for authentic Assamese Mekhela Sadors, sarees, and handcrafted fashion.',
            'cta_text': 'Shop Collection',
            'cta_link': '/shop',
            'secondary_cta_text': 'Follow Us',
            'secondary_cta_link': 'https://www.instagram.com/ebasistore_traditionalattire/',
            'image_url_fallback': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
            'image_alt': 'Authentic handcrafted Assamese Mekhela Sador and traditional boutique collection',
            'floating_card_title': 'Handcrafted Mekhela Sador',
            'floating_card_subtitle': 'Explore our handpicked curation of elegant Assamese wear.',
            'is_active': True,
        }
    )

    # 4. Page Contents
    # A. About Us
    PageContent.objects.get_or_create(
        slug='about',
        defaults={
            'title': 'About Ms Ebasi Store',
            'subtitle': 'Celebrating the timeless artistry of Assamese handlooms, Deori Egu-Jokasiba, and authentic ethnic wear.',
            'intro': 'Celebrating the timeless artistry of Assamese handlooms, Deori Egu-Jokasiba, and authentic ethnic wear.',
            'content_json': {
                'heritage_story_title': 'Our Heritage & Story',
                'story_paragraphs': [
                    'Ms Ebasi Store (EBASI ENTERPRISE) is an authentic clothing brand and boutique based in Dhemaji, Assam. We are dedicated to preserving and showcasing the indigenous weaving traditions of Northeast India, including sacred Deori Egu-Jokasiba, traditional Mekhela Sador, Gamusa, and handcrafted sarees.',
                    'With over 1,000+ satisfied clients across Assam and all of India, our mission is to deliver pure, genuine handloom fabrics directly from local weavers to your wardrobe with uncompromised quality and personalized care.',
                    'Every piece in our boutique is a testament to cultural pride, crafted by skilled weavers who pour heritage, geometry, and intricate zari into every thread.'
                ],
                'core_values': [
                    {
                        'title': 'Pure Indigenous Handloom',
                        'description': 'Authentic Deori Egu-Jokasiba, Muga, Paat, Tos, and Kesavan cotton handloom sets crafted with genuine traditional motifs.'
                    },
                    {
                        'title': '1000+ Happy Clients',
                        'description': 'A trusted community of women celebrating handlooms with high customer satisfaction and repeat orders across India.'
                    },
                    {
                        'title': 'Transparent Direct Ordering',
                        'description': 'Personalized 1-on-1 WhatsApp assistance, verified prepaid ordering, and direct dispatch from Dhemaji, Assam.'
                    }
                ],
                'specialties': [
                    {
                        'title': 'Deori Egu-Jokasiba',
                        'description': 'Sacred and traditional attire of the Deori community, handcrafted with authentic tribal patterns, geometric precision, and cultural reverence.'
                    },
                    {
                        'title': 'Mekhela Sador Sets',
                        'description': 'Exquisite two-piece Assamese attire woven in Muga, Paat silk, Tos, and pure cotton, adorned with intricate Guna and Mina kari zari borders.'
                    },
                    {
                        'title': 'Traditional Gamusa & Sarees',
                        'description': 'Handwoven Assamese Gamusas and festive sarees crafted for weddings, Bihu celebrations, and formal cultural events.'
                    }
                ]
            },
            'last_updated_date': 'January 15, 2024',
            'is_published': True,
        }
    )

    # B. Privacy Policy
    PageContent.objects.get_or_create(
        slug='privacy-policy',
        defaults={
            'title': 'Privacy Policy',
            'subtitle': 'Our Commitment to Your Privacy',
            'intro': 'At EBASI STORE, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.',
            'content_json': {
                'sections': [
                    {
                        'heading': '1. Information We Collect',
                        'content': 'We collect information you provide directly to us when browsing products, initiating orders, and contacting our boutique.',
                        'bullets': [
                            'Personal Information: Name, email address, contact phone number, shipping address.',
                            'Usage Data: Browsing behavior, product inquiries, wishlist selections, device info and IP address.',
                            'Communication Records: WhatsApp inquiries and contact form submissions.'
                        ]
                    },
                    {
                        'heading': '2. How We Use Your Information',
                        'content': 'We utilize your information to provide personalized shopping and direct customer support.',
                        'bullets': [
                            'Process and fulfill your handloom orders and direct deliveries.',
                            'Provide direct 1-on-1 WhatsApp customer assistance and order status updates.',
                            'Send product recommendations, new arrivals, and boutique notices.',
                            'Improve store performance, inventory availability, and customer satisfaction.'
                        ]
                    },
                    {
                        'heading': '3. Information Sharing and Disclosure',
                        'content': 'We do not sell, rent, or trade your personal information to third parties. Information is only shared with verified courier partners to deliver parcels directly from Dhemaji, Assam, or when required by legal regulations.',
                        'bullets': []
                    },
                    {
                        'heading': '4. Data Security & Storage',
                        'content': 'We implement appropriate technical measures including SSL encryption, secure tokens, and access controls to safeguard your data against unauthorized access or alteration.',
                        'bullets': []
                    },
                    {
                        'heading': '5. Your Rights and Choices',
                        'content': 'You have the right to request access, correction, or deletion of your personal data stored with us at any time by contacting our support team.',
                        'bullets': []
                    }
                ]
            },
            'last_updated_date': 'January 15, 2024',
            'is_published': True,
        }
    )

    # C. Terms of Service
    PageContent.objects.get_or_create(
        slug='terms-of-service',
        defaults={
            'title': 'Terms of Service',
            'subtitle': 'Agreement to Terms',
            'intro': 'Welcome to EBASI STORE. These Terms of Service govern your use of our website and ordering services. By accessing or using our services, you agree to be bound by these Terms.',
            'content_json': {
                'sections': [
                    {
                        'heading': '1. Product Authenticity & Handloom Variations',
                        'content': 'All handloom textiles featured at Ms Ebasi Store are authentically woven. Minor variations in texture, yarn shade, and hand-embroidered motifs are natural characteristics of authentic handlooms, celebrating artisan craftsmanship.',
                        'bullets': []
                    },
                    {
                        'heading': '2. Ordering and Payment Terms',
                        'content': 'Orders are confirmed via direct WhatsApp coordination and verified UPI payment. As items are handcrafted in limited batches, availability is confirmed at the time of inquiry.',
                        'bullets': [
                            'Accepted payment methods: UPI (Google Pay, PhonePe, Paytm), Net Banking, Direct Bank Transfer.',
                            'Cash on Delivery (COD) is not available due to direct dispatch of high-value authentic handloom fabrics.',
                            'Dispatches are initiated promptly upon payment confirmation.'
                        ]
                    },
                    {
                        'heading': '3. Shipping and Delivery',
                        'content': 'We ship securely to addresses across India directly from Dhemaji, Assam. Tracking details are provided via WhatsApp as soon as parcel consignment is booked.',
                        'bullets': []
                    },
                    {
                        'heading': '4. Returns and Exchanges',
                        'content': 'Customer satisfaction is our priority. If an item received is defective or damaged during transit, please notify us within 48 hours of delivery with unboxing proof for prompt resolution.',
                        'bullets': []
                    },
                    {
                        'heading': '5. Governing Law and Jurisdiction',
                        'content': 'These Terms are governed by the laws of India. Any legal disputes shall be subject to the exclusive jurisdiction of the competent courts in Dhemaji, Assam.',
                        'bullets': []
                    }
                ]
            },
            'last_updated_date': 'January 15, 2024',
            'is_published': True,
        }
    )

    # D. Contact Page Content
    PageContent.objects.get_or_create(
        slug='contact',
        defaults={
            'title': 'Get in Touch',
            'subtitle': 'Send us a Message',
            'intro': 'We would love to hear from you. Send us a message or connect directly on WhatsApp for personalized orders and handloom inquiries.',
            'content_json': {
                'form_title': 'Send us a Message',
                'form_subtitle': 'Fill out the form below or chat directly on WhatsApp for instant assistance.',
                'response_time_note': 'We usually respond within a few hours during boutique operational hours.'
            },
            'last_updated_date': 'January 15, 2024',
            'is_published': True,
        }
    )


def remove_cms_data(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_cms_data, remove_cms_data),
    ]
