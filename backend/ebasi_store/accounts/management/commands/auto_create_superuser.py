from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from decouple import config


class Command(BaseCommand):
    help = 'Creates a superuser non-interactively if one does not exist, or updates password if explicitly requested.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset-password',
            action='store_true',
            dest='reset_password',
            help='Explicitly force reset the password for existing superuser using DJANGO_SUPERUSER_PASSWORD',
        )

    def handle(self, *args, **options):
        User = get_user_model()

        superuser_username = config("DJANGO_SUPERUSER_USERNAME", default=None)
        superuser_email = config("DJANGO_SUPERUSER_EMAIL", default=None)
        superuser_password = config("DJANGO_SUPERUSER_PASSWORD", default=None)
        force_reset = options.get('reset_password') or config("DJANGO_SUPERUSER_RESET_PASSWORD", default=False, cast=bool)

        if not superuser_username:
            self.stdout.write(self.style.WARNING('DJANGO_SUPERUSER_USERNAME is not set. Skipping auto superuser creation.'))
            return

        try:
            user = User.objects.filter(username__iexact=superuser_username).first()
            if not user and superuser_email:
                user = User.objects.filter(email__iexact=superuser_email).first()

            if user:
                # Existing superuser: do NOT overwrite password unless explicitly flagged
                if force_reset:
                    if not superuser_password:
                        self.stdout.write(self.style.ERROR('DJANGO_SUPERUSER_PASSWORD is required when resetting password.'))
                        return
                    user.set_password(superuser_password)
                    self.stdout.write(self.style.SUCCESS(f'Successfully reset password for existing superuser: {user.username}'))
                else:
                    self.stdout.write(self.style.NOTICE(f'Superuser "{user.username}" already exists. Preserving existing password.'))

                # Ensure admin privilege flags remain active
                user.is_staff = True
                user.is_superuser = True
                user.is_active = True
                user.save()
            else:
                # Superuser does not exist: initial creation requires DJANGO_SUPERUSER_PASSWORD
                if not superuser_password:
                    self.stdout.write(self.style.ERROR('DJANGO_SUPERUSER_PASSWORD is required to create a new superuser.'))
                    return

                user = User.objects.create_superuser(
                    username=superuser_username,
                    email=superuser_email or '',
                    password=superuser_password
                )
                user.is_staff = True
                user.is_superuser = True
                user.is_active = True
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Successfully created new superuser: {superuser_username}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error configuring superuser: {str(e)}'))
