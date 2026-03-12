from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Users'

    def ready(self):
        """
        For local/demo use: ensure there is at least one default user
        that can be used to log into the dashboard without running
        createsuperuser manually.

        Username: demo
        Password: demo1234
        """
        from django.contrib.auth import get_user_model

        User = get_user_model()
        if not User.objects.filter(username="demo").exists():
            User.objects.create_user(
                username="demo",
                password="demo1234",
                email="demo@example.com",
                is_staff=True,
                is_superuser=True,
            )
