from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Create an admin user'

    def add_arguments(self, parser):
        parser.add_argument("username")
        parser.add_argument("email")
        parser.add_argument("password")

    def handle(self, *args, **options):
        if not User.objects.filter(username=options['username']).exists():
            User.objects.create_superuser(options['username'], options['email'], options['password'])
