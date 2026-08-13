import os
import django
import random
import requests
from django.utils.text import slugify
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ebasi_store.settings')
django.setup()

from SHOP.models import Category, Product, ProductImage

def populate_test_catalog():
  print("Updating and populating temporary test/dummy catalog data with images...")

  categories_info = [
      ("Traditional Mekhela Chador", "traditional-mekhela-chador", "Assamese Handwoven Mekhela Sador"),
      ("Sarees", "sarees", "Silk, Cotton & Chiffon Sarees"),
      ("Designer Collection", "designer-collection", "Exclusive Designer Ethnic Sets"),
      ("Festive Wear", "festive-wear", "Handcrafted Festive Attire"),
  ]

  categories = {}
  for name, slug, desc in categories_info:
    cat, _ = Category.objects.get_or_create(
        name=name,
        defaults={"slug": slug, "description": desc, "is_active": True}
    )
    categories[slug] = cat

  dummy_items = [
      {
          "name": "[TEST] Royal Blue Muga Silk Mekhela Sador",
          "slug": "dummy-royal-blue-muga-silk-mekhela-sador",
          "category": categories["traditional-mekhela-chador"],
          "price": 6800.00,
          "compare_price": 8500.00,
          "stock_status": "in_stock",
          "stock_quantity": 8,
          "badge": "best_seller",
          "is_featured": True,
          "description": "[TEST DUMMY DATA] Authentic Assamese Royal Blue Muga Silk Mekhela Sador with golden zari embroidery. Includes unstitched blouse piece.",
          "short": "Assamese Muga Silk with golden zari motifs",
          "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"
      },
      {
          "name": "[TEST] Handwoven Kesavan Cotton Mekhela Sador",
          "slug": "dummy-handwoven-kesavan-cotton-mekhela-sador",
          "category": categories["traditional-mekhela-chador"],
          "price": 3200.00,
          "compare_price": 4000.00,
          "stock_status": "in_stock",
          "stock_quantity": 15,
          "badge": "new_arrival",
          "is_featured": True,
          "description": "[TEST DUMMY DATA] Lightweight breathable cotton Mekhela Sador featuring traditional floral borders. Ideal for summer and daily wear.",
          "short": "Lightweight pure cotton traditional set",
          "image_url": "https://images.unsplash.com/photo-1583391733975-fa7713f06c1c?w=800&q=80"
      },
      {
          "name": "[TEST] Crimson Red Mulberry Silk Saree",
          "slug": "dummy-crimson-red-mulberry-silk-saree",
          "category": categories["sarees"],
          "price": 5400.00,
          "compare_price": 6500.00,
          "stock_status": "out_of_stock",
          "stock_quantity": 0,
          "badge": "hot",
          "is_featured": True,
          "description": "[TEST DUMMY DATA] Vibrant crimson red mulberry silk saree with rich woven pallu and contrasting border.",
          "short": "Pure mulberry silk with rich contrast pallu",
          "image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"
      },
      {
          "name": "[TEST] Lavender Floral Organza Designer Saree",
          "slug": "dummy-lavender-floral-organza-designer-saree",
          "category": categories["designer-collection"],
          "price": 4200.00,
          "compare_price": 5200.00,
          "stock_status": "in_stock",
          "stock_quantity": 5,
          "badge": "trending",
          "is_featured": True,
          "description": "[TEST DUMMY DATA] Sheer lavender organza saree featuring hand-painted floral motifs and delicate gota patti edging.",
          "short": "Sheer organza with hand-painted floral art",
          "image_url": "https://images.unsplash.com/photo-1631233859262-0d62bfce5a3f?w=800&q=80"
      },
      {
          "name": "[TEST] Emerald Green Chanderi Anarkali Set",
          "slug": "dummy-emerald-green-chanderi-anarkali-set",
          "category": categories["festive-wear"],
          "price": 4900.00,
          "compare_price": 6000.00,
          "stock_status": "limited_stock",
          "stock_quantity": 2,
          "badge": "limited_edition",
          "is_featured": True,
          "description": "[TEST DUMMY DATA] Floor-length emerald green Chanderi silk Anarkali suit set with hand-embroidered dupatta.",
          "short": "Chanderi silk festive Anarkali suit set",
          "image_url": "https://images.unsplash.com/photo-1583391733956-6c782764726f?w=800&q=80"
      },
      {
          "name": "[TEST] Peach Pastel Tos Silk Mekhela Sador",
          "slug": "dummy-peach-pastel-tos-silk-mekhela-sador",
          "category": categories["traditional-mekhela-chador"],
          "price": 7500.00,
          "compare_price": 9200.00,
          "stock_status": "in_stock",
          "stock_quantity": 4,
          "badge": "featured",
          "is_featured": True,
          "description": "[TEST DUMMY DATA] Exquisite peach pastel Tos Silk Mekhela Sador adorned with silver and copper Kingkhap weave.",
          "short": "Tos Silk with silver Kingkhap motif",
          "image_url": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80"
      },
  ]

  for item in dummy_items:
    prod, created = Product.objects.get_or_create(
        slug=item["slug"],
        defaults={
            "name": item["name"],
            "category": item["category"],
            "price": item["price"],
            "compare_price": item["compare_price"],
            "stock_status": item["stock_status"],
            "stock_quantity": item["stock_quantity"],
            "badge": item["badge"],
            "is_featured": item["is_featured"],
            "description": item["description"],
            "short_description": item["short"],
            "sku": f"DUMMY-{item['slug'].upper()[:12]}",
            "is_active": True,
        }
    )

    # Ensure test product attributes are updated
    prod.is_featured = True
    prod.is_active = True
    prod.save()

    # Download image if product has no primary image
    if not prod.images.exists() and "image_url" in item:
      try:
        response = requests.get(item["image_url"])
        if response.status_code == 200:
          prod.images.create(
              image=ContentFile(response.content, name=f"{prod.slug}.jpg"),
              alt_text=prod.name,
              is_primary=True
          )
          print(f"  + Downloaded image for {prod.name}")
      except Exception as e:
        print(f"  ! Failed downloading image for {prod.name}: {e}")

  print("Dummy catalog populating complete!")

if __name__ == "__main__":
  populate_test_catalog()
