from pathlib import Path

import xgboost as xgb
from stable_baselines3 import PPO  # RL policy class used for the cooling controller


BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"

rbs_model_instance = None
freq_model_instance = None
rl_model = None


def load_rbs_model():
    """
    Load (and cache) the XGBoost model used for RBS prediction.
    Model file: ai_model/models/xgb_rbs_model.json
    """
    global rbs_model_instance
    if rbs_model_instance is None:
        model_path = MODELS_DIR / "xgb_rbs_model.json"
        rbs_model_instance = xgb.XGBRegressor()
        rbs_model_instance.load_model(str(model_path))
    return rbs_model_instance


def load_freq_model():
    """
    Load (and cache) the XGBoost model used for frequency prediction.
    Model file: ai_model/models/xgb_freq_model.json
    """
    global freq_model_instance
    if freq_model_instance is None:
        model_path = MODELS_DIR / "xgb_freq_model.json"
        freq_model_instance = xgb.XGBRegressor()
        freq_model_instance.load_model(str(model_path))
    return freq_model_instance


class _DummyRLPolicy:
    """
    Fallback policy used when the real RL model file is not present.
    It simply returns a neutral action (0).
    """

    def predict(self, observation, deterministic: bool = False):
        return [0], None


def load_rl_model():
    """
    Load (and cache) the RL policy model.
    If the model file is missing, fall back to a dummy policy so the API
    can still run without crashing.
    """
    global rl_model
    if rl_model is None:
        model_path = MODELS_DIR / "dc_cooling_ppo.zip"
        if model_path.exists():
            rl_model = PPO.load(str(model_path))
        else:
            rl_model = _DummyRLPolicy()
    return rl_model
