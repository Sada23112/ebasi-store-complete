import os
import django
import shutil

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ebasi_store.settings")
django.setup()

from SHOP.models import Product, ProductImage, ProductVideo
from django.conf import settings

def clear_products():
    print("Initializing product cleanup...")
    
    # query all products
    products = Product.objects.all()
    count = products.count()
    
    if count == 0:
        print("No products found to delete.")
        return

    print(f"Found {count} products. Deleting...")

    deleted_images_count = 0
    deleted_videos_count = 0

    for product in products:
        print(f"Processing product: {product.name} (ID: {product.id})")
        
        # 1. Delete Product Images
        for p_img in product.images.all():
            if p_img.image:
                try:
                    # check if file exists and delete it
                    p_img.image.delete(save=False) 
                    # check if file exists on disk (for local storage)
                    # For cloud storage, the delete() method on the field usually handles it if configured,
                    # but standard django ImageField.delete() might not remove from disk depending on backend.
                    # With standard file system storage:
                    path = os.path.join(settings.MEDIA_ROOT, p_img.image.name)
                    if os.path.exists(path):
                         os.remove(path)
                         print(f"  - Deleted image file: {path}")
                    
                    deleted_images_count += 1
                except Exception as e:
                    print(f"  - Error deleting image file {p_img.image}: {e}")
        
        # 2. Delete Product Videos
        for p_vid in product.videos.all():
            if p_vid.video:
                try:
                    p_vid.video.delete(save=False)
                    path = os.path.join(settings.MEDIA_ROOT, p_vid.video.name)
                    if os.path.exists(path):
                         os.remove(path)
                    deleted_videos_count += 1
                except Exception as e:
                    print(f"  - Error deleting video file {p_vid.video}: {e}")
            
            if p_vid.thumbnail:
                try:
                    p_vid.thumbnail.delete(save=False)
                    path = os.path.join(settings.MEDIA_ROOT, p_vid.thumbnail.name)
                    if os.path.exists(path):
                         os.remove(path)
                except Exception as e:
                    print(f"  - Error deleting video thumbnail {p_vid.thumbnail}: {e}")

        # 3. Delete the Product instance
        product.delete()

    print("-" * 30)
    print(f"Cleanup Complete.")
    print(f"Deleted {count} Products.")
    print(f"Deleted {deleted_images_count} Product Images.")
    print(f"Deleted {deleted_videos_count} Product Videos.")

if __name__ == "__main__":
    clear_products()
