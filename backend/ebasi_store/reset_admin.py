import os
import django

# Setup Django environment for standalone execution
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ebasi_store.settings")
django.setup()

from django.contrib.auth import get_user_model

def reset_superusers():
    print("Initializing...")
    User = get_user_model()
    
    # 1. Delete all superusers
    print("Scanning for existing superusers...")
    superusers = User.objects.filter(is_superuser=True)
    count = superusers.count()
    if count > 0:
        print(f"Found {count} superusers. Deleting...")
        superusers.delete()
        print("All existing superusers deleted.")
    else:
        print("No existing superusers found.")

    # 2. Create new superuser
    target_username = "The Ebasi Store Admin Panel"
    target_password = "TESAPanel_12"
    target_email = "admin@ebasistore.com"

    print(f"Attempting to create new superuser: '{target_username}'")
    
    try:
        User.objects.create_superuser(username=target_username, email=target_email, password=target_password)
        print(f"SUCCESS: Created superuser '{target_username}'")
    except Exception as e:
        print(f"WARNING: Could not create superuser with spaces: {e}")
        # Fallback: Replace spaces with underscores
        fallback_username = target_username.replace(" ", "_")
        print(f"Attempting fallback username: '{fallback_username}'")
        try:
            User.objects.create_superuser(username=fallback_username, email=target_email, password=target_password)
            print(f"SUCCESS: Created superuser '{fallback_username}'")
        except Exception as e2:
            print(f"ERROR: Failed to create fallback superuser: {e2}")

if __name__ == "__main__":
    reset_superusers()
