import os
from pydantic import BaseModel

class Settings(BaseModel):
    app_name: str = "FieldLens AI"
    tagline: str = "Private On-Device AI for Equipment Inspection & Maintenance"
    ai_provider: str = os.getenv("AI_PROVIDER", "development") # qualcomm, local, development
    qualcomm_runtime: str = os.getenv("QUALCOMM_RUNTIME", "auto")
    model_cache_dir: str = os.getenv("MODEL_CACHE_DIR", "./models")
    storage_dir: str = os.getenv("STORAGE_DIR", "./storage")
    max_upload_mb: int = int(os.getenv("MAX_UPLOAD_MB", "25"))
    port: int = int(os.getenv("PORT", "8000"))

settings = Settings()
