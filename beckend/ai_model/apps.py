from django.apps import AppConfig
from .ml import load_rbs_model, load_freq_model, load_rl_model


class AiModelConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ai_model'

    def ready(self):
        """
        Load ML models when the app is ready.
        If model files are missing (e.g. in a fresh dev environment),
        fail gracefully so migrations and the server can still start.
        """
        try:
            load_rbs_model()
            load_freq_model()
            load_rl_model()
        except Exception:
            # In dev environments without model files, just skip loading.
            # The endpoints depending on these models may return errors until models are provided.
            pass

