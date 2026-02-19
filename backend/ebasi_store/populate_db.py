
import os
import django
import random
from django.utils.text import slugify

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ebasi_store.settings')
django.setup()

from SHOP.models import Category, Product, ProductImage

def create_categories():
    categories_data = [
        {"name": "Sarees", "description": "Elegant traditional sarees"},
        {"name": "Women", "description": "Modern women's fashion"},
        {"name": "Ethnic", "description": "Ethnic wear for special occasions"},
        {"name": "Casual", "description": "Comfortable daily wear"},
    ]
    
    categories = []
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data["name"],
            defaults={
                "slug": slugify(cat_data["name"]),
                "description": cat_data["description"]
            }
        )
        categories.append(category)
        if created:
            print(f"Created category: {category.name}")
        else:
            print(f"Category already exists: {category.name}")
    return categories

def create_products(categories):
    products_data = [
        {
            "name": "Elegant Silk Saree",
            "category": "Sarees",
            "price": 2499.00,
            "compare_price": 3499.00,
            "features": "Pure silk, Handwoven, Traditional design",
            "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"
        },
        {
            "name": "Designer Kurti Set",
            "category": "Women",
            "price": 1899.00,
            "compare_price": 2499.00,
            "features": "Cotton blend, Machine washable, Comfortable fit",
            "image_url": "https://images.unsplash.com/photo-1583391733975-fa7713f06c1c?w=800&q=80"
        },
        {
            "name": "Traditional Lehenga",
            "category": "Ethnic",
            "price": 4999.00,
            "compare_price": 6999.00,
            "features": "Heavy embroidery, Premium fabric, Designer piece",
            "image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"
        },
        {
            "name": "Cotton Palazzo Set",
            "category": "Casual",
            "price": 1299.00,
            "compare_price": 1799.00,
            "features": "100% cotton, Breathable, Easy care",
            "image_url": "https://images.unsplash.com/photo-1631233859262-0d62bfce5a3f?w=800&q=80"
        },
        {
            "name": "Banarasi Silk Saree",
            "category": "Sarees",
            "price": 3999.00,
            "compare_price": 5499.00,
            "features": "Pure Banarasi Silk, Zari Work, Rich Pallu",
            "image_url": "https://images.unsplash.com/photo-1583391733956-6c782764726f?w=800&q=80"
        },
        {
            "name": "Embroidered Anarkali Suit",
            "category": "Ethnic",
            "price": 2999.00,
            "compare_price": 3999.00,
            "features": "Georgette Fabric, intricate embroidery, party wear",
            "image_url": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80"
        }
    ]

    for prod_data in products_data:
        category = next(c for c in categories if c.name == prod_data["category"])
        
        product, created = Product.objects.get_or_create(
            name=prod_data["name"],
            defaults={
                "slug": slugify(prod_data["name"]),
                "description": f"Description for {prod_data['name']}. {prod_data['features']}",
                "short_description": prod_data["features"],
                "category": category,
                "price": prod_data["price"],
                "compare_price": prod_data["compare_price"],
                "sku": f"SKU-{slugify(prod_data['name']).upper()}-{random.randint(100, 999)}",
                "stock_quantity": random.randint(10, 50),
                "is_featured": True,
                "is_active": True
            }
        )
        
        # Create ProductImage if not exists (whether product is new or old)
        if "image_url" in prod_data:
            if not product.images.exists():
                try:
                    import requests
                    from django.core.files.base import ContentFile
                    
                    response = requests.get(prod_data["image_url"])
                    if response.status_code == 200:
                        product.images.create(
                            image=ContentFile(response.content, name=f"{product.slug}.jpg"),
                            alt_text=product.name,
                            is_primary=True
                        )
                        print(f"  Downloaded and saved image for {product.name}")
                except ImportError:
                    print(f"  Requests not installed, skipping image download for {product.name}")
                except Exception as e:
                    print(f"  Failed to save image for {product.name}: {e}")
            else:
                print(f"  Product {product.name} already has images.")

if __name__ == "__main__":
    print("Starting database population...")
    try:
        categories = create_categories()
        create_products(categories)
        print("Database population completed successfully!")
    except Exception as e:
        print(f"Error populating database: {e}")
