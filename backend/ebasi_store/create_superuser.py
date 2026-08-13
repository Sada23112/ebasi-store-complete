
import os
import django
from django.contrib.auth import get_user_model
from decouple import config

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ebasi_store.settings')
django.setup()

User = get_user_model()
username = config('DJANGO_SUPERUSER_USERNAME', default='admin')
password = config('DJANGO_SUPERUSER_PASSWORD', default=None)
email = config('DJANGO_SUPERUSER_EMAIL', default='admin@ebasistore.com')

if not password:
    print("ERROR: DJANGO_SUPERUSER_PASSWORD environment variable is required.")
else:
    if not User.objects.filter(username=username).exists():
        print(f"Creating superuser {username}...")
        User.objects.create_superuser(username=username, email=email, password=password)
        print("Superuser created.")
    else:
        print(f"Superuser {username} already exists.")

