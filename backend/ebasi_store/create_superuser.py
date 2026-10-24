import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ebasi_store.settings')
django.setup()

from django.core.management import call_command

def main():
    reset = "--reset-password" in sys.argv
    call_command('auto_create_superuser', reset_password=reset)

if __name__ == "__main__":
    main()
