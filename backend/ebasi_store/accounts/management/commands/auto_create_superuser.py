from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    help = 'Creates or updates a superuser non-interactively'

    def handle(self, *args, **options):
        User = get_user_model()
        
        from decouple import config

        superuser_username = config("DJANGO_SUPERUSER_USERNAME", default="Sadananda")
        superuser_email = config("DJANGO_SUPERUSER_EMAIL", default="sadanandaboruah231@gmail.com")
        superuser_password = config("DJANGO_SUPERUSER_PASSWORD", default="Sadananda_12")

        if not superuser_password:
            self.stdout.write(self.style.ERROR('DJANGO_SUPERUSER_PASSWORD is required.'))
            return

        try:
            user = User.objects.filter(username__iexact=superuser_username).first()
            if not user:
                user = User.objects.filter(email__iexact=superuser_email).first()

            if user:
                user.username = superuser_username
                user.email = superuser_email
                user.set_password(superuser_password)
                user.is_staff = True
                user.is_superuser = True
                user.is_active = True
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Successfully updated password for existing superuser: {superuser_username}'))
            else:
                user = User.objects.create_superuser(
                    username=superuser_username,
                    email=superuser_email,
                    password=superuser_password
                )
                user.is_staff = True
                user.is_superuser = True
                user.is_active = True
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Successfully created new superuser: {superuser_username}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error configuring superuser: {str(e)}'))
