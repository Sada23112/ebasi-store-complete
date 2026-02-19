import os
import django
import requests
from django.core.files.base import ContentFile
from django.utils.text import slugify

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ebasi_store.settings')
django.setup()

from SHOP.models import Category, Product, ProductImage

def create_gallery_product():
    product_name = "Royal Blue Kanjivaram Silk Saree"
    sku = "SKU-KANJIVARAM-BLUE-001"
    
    # 1. Get or Create Category
    category, _ = Category.objects.get_or_create(
        name="Sarees",
        defaults={"slug": "sarees", "description": "Elegant traditional sarees"}
    )
    
    # 2. Get or Create Product
    product, created = Product.objects.get_or_create(
        sku=sku,
        defaults={
            "name": product_name,
            "slug": slugify(product_name),
            "description": "Exquisite Royal Blue Kanjivaram Silk Saree with rich gold zari border. Perfect for weddings and special occasions. Features intricate motifs and a grand pallu.",
            "short_description": "Royal Blue, Pure Silk, Gold Zari",
            "category": category,
            "price": 12999.00,
            "compare_price": 15999.00,
            "stock_quantity": 5,
            "stock_status": 'in_stock',
            "is_featured": True,
            "is_active": True
        }
    )
    
    if created:
        print(f"Created product: {product.name}")
    else:
        print(f"Product already exists: {product.name}")
        # Optional: Clear existing images to avoid duplicates if re-running
        # product.images.all().delete() 

    # 3. Add Images
    # We will check if images exist to avoid adding them multiple times if script re-runs
    if product.images.count() == 0:
        print("Adding images...")
        
        image_urls = [
            ("https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80", "Front View"),
            ("https://images.unsplash.com/photo-1583391733956-6c782764726f?w=800&q=80", "Pallu Detail"),
            ("https://placehold.co/800x1200/1e3a8a/FFF.png?text=Model+Side+View", "Model View"),
            ("https://placehold.co/800x800/1e3a8a/FFF.png?text=Folded+Back+View", "Folded View")
        ]
        
        for i, (url, alt) in enumerate(image_urls):
            try:
                print(f"Downloading {alt} from {url}...")
                response = requests.get(url)
                if response.status_code == 200:
                    img_name = f"{slugify(product_name)}-{i+1}.png"
                    product.images.create(
                        image=ContentFile(response.content, name=img_name),
                        alt_text=alt,
                        is_primary=(i == 0),
                        order=i
                    )
                    print(f"  Added image: {alt}")
                else:
                    print(f"  Failed to download {url}: Status {response.status_code}")
            except Exception as e:
                print(f"  Error adding image {alt}: {e}")
    else:
        print(f"Product already has {product.images.count()} images.")
        
    print("Done!")

if __name__ == "__main__":
    create_gallery_product()
