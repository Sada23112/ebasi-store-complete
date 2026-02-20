from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    help = 'Creates a superuser non-interactively if it does not exist'

    def handle(self, *args, **options):
        User = get_user_model()
        superuser_email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
        superuser_password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

        if not superuser_email or not superuser_password:
            self.stdout.write(self.style.WARNING(
                'Superuser email or password not set in environment variables. Skipping creation.'
            ))
            return

        if User.objects.filter(email=superuser_email).exists() or User.objects.filter(is_superuser=True).exists():
            self.stdout.write(self.style.SUCCESS(
                'Superuser already exists. Skipping creation.'
            ))
            return

        # Handle custom user models which use email as username
        try:
            User.objects.create_superuser(
                email=superuser_email,
                password=superuser_password
            )
            self.stdout.write(self.style.SUCCESS(f'Successfully created new superuser: {superuser_email}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating superuser: {str(e)}'))
