from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    help = 'Creates a superuser non-interactively if it does not exist'

    def handle(self, *args, **options):
        User = get_user_model()
        
        from decouple import config

        superuser_username = config("DJANGO_SUPERUSER_USERNAME", default="TheEbasiStoreAdminPanel")
        superuser_email = config("DJANGO_SUPERUSER_EMAIL", default="admin@ebasistore.com")
        superuser_password = config("DJANGO_SUPERUSER_PASSWORD", default=None)

        if not superuser_password:
            self.stdout.write(self.style.ERROR('DJANGO_SUPERUSER_PASSWORD environment variable is required to auto-create a superuser.'))
            return


        # Check if the user exists
        if User.objects.filter(username=superuser_username).exists() or User.objects.filter(email=superuser_email).exists():
            self.stdout.write(self.style.SUCCESS(
                'Superuser already exists. Skipping creation.'
            ))
            return

        try:
            # Django's create_superuser allows username + email
            # Some custom models use explicitly email, so we safeguard with keyword args depending on model
            if hasattr(User, 'USERNAME_FIELD') and User.USERNAME_FIELD == 'email':
                User.objects.create_superuser(
                    email=superuser_email,
                    password=superuser_password
                )
            else:
                User.objects.create_superuser(
                    username=superuser_username,
                    email=superuser_email,
                    password=superuser_password
                )
            self.stdout.write(self.style.SUCCESS(f'Successfully created new superuser: {superuser_username}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating superuser: {str(e)}'))
