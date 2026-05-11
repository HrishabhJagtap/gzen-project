"""Configuration: env vars + MongoDB connection."""
import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES_MIN = 60 * 24 * 7  # 7 days for hackathon convenience
EMERGENT_LLM_KEY = os.environ["EMERGENT_LLM_KEY"]
FRONTEND_URL = os.environ.get("FRONTEND_URL", "*")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "ansh@gzen.app")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "gzen1234")

mongo_client = AsyncIOMotorClient(MONGO_URL)
db = mongo_client[DB_NAME]
