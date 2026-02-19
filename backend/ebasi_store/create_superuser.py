
import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ebasi_store.settings')
django.setup()

User = get_user_model()
username = 'SADA'
password = '12345'
email = 'admin@ebasistore.com'

if not User.objects.filter(username=username).exists():
    print(f"Creating superuser {username}...")
    User.objects.create_superuser(username=username, email=email, password=password)
    print("Superuser created.")
else:
    print(f"Superuser {username} already exists.")
