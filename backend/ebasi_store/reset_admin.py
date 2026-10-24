import os
import sys
import django

# Setup Django environment for standalone execution
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ebasi_store.settings")
django.setup()

from django.contrib.auth import get_user_model
from decouple import config

def reset_superusers():
    """
    Safely resets or provisions a superuser using environment variables.
    Requires DJANGO_SUPERUSER_USERNAME and DJANGO_SUPERUSER_PASSWORD.
    """
    print("Initializing admin provisioning...")
    User = get_user_model()

    target_username = config("DJANGO_SUPERUSER_USERNAME", default=None)
    target_password = config("DJANGO_SUPERUSER_PASSWORD", default=None)
    target_email = config("DJANGO_SUPERUSER_EMAIL", default=None)

    if not target_username or not target_password:
        print("ERROR: DJANGO_SUPERUSER_USERNAME and DJANGO_SUPERUSER_PASSWORD environment variables are required.")
        print("Usage: Set both environment variables before executing this script.")
        sys.exit(1)

    confirm_delete = "--confirm-delete" in sys.argv
    if confirm_delete:
        print("Deleting existing superusers due to explicit --confirm-delete flag...")
        superusers = User.objects.filter(is_superuser=True)
        count = superusers.count()
        if count > 0:
            superusers.delete()
            print(f"Deleted {count} superusers.")

    user = User.objects.filter(username__iexact=target_username).first()
    if not user and target_email:
        user = User.objects.filter(email__iexact=target_email).first()

    if user:
        print(f"Updating credentials for existing superuser: '{user.username}'")
        user.set_password(target_password)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        if target_email:
            user.email = target_email
        user.save()
        print(f"SUCCESS: Updated password for '{user.username}'")
    else:
        print(f"Creating new superuser: '{target_username}'")
        try:
            User.objects.create_superuser(
                username=target_username,
                email=target_email or '',
                password=target_password
            )
            print(f"SUCCESS: Created superuser '{target_username}'")
        except Exception as e:
            print(f"ERROR: Failed to create superuser: {e}")
            sys.exit(1)

if __name__ == "__main__":
    reset_superusers()
