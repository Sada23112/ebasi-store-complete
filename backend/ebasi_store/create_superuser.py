
import os
import django
from django.contrib.auth import get_user_model
from decouple import config

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ebasi_store.settings')
django.setup()

User = get_user_model()
username = config('DJANGO_SUPERUSER_USERNAME', default='Sadananda')
password = config('DJANGO_SUPERUSER_PASSWORD', default='Sadananda_12')
email = config('DJANGO_SUPERUSER_EMAIL', default='sadanandaboruah231@gmail.com')

user = User.objects.filter(username__iexact=username).first()
if not user:
    user = User.objects.filter(email__iexact=email).first()

if user:
    user.username = username
    user.email = email
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.save()
    print(f"Superuser {username} password updated successfully.")
else:
    user = User.objects.create_superuser(username=username, email=email, password=password)
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.save()
    print(f"Superuser {username} created successfully.")

