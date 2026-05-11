"""Gzen FastAPI server — entry point."""
from dotenv import load_dotenv
from pathlib import Path

# load env BEFORE other imports so config can read it
load_dotenv(Path(__file__).parent / ".env")

import logging
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

from config import db, mongo_client, FRONTEND_URL, ADMIN_EMAIL, ADMIN_PASSWORD
from auth_utils import hash_password, verify_password
from routes.auth_routes import router as auth_router
from routes.profile_routes import router as profile_router
from routes.analytics_routes import router as analytics_router
from routes.value_gate_routes import router as value_gate_router
from routes.ai_routes import router as ai_router
from routes.rewards_routes import router as rewards_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s — %(message)s")
logger = logging.getLogger("gzen")

app = FastAPI(title="Gzen API", version="1.0.0")

# All routes mounted under /api per ingress rules.
api = APIRouter(prefix="/api")
api.include_router(auth_router)
api.include_router(profile_router)
api.include_router(analytics_router)
api.include_router(value_gate_router)
api.include_router(ai_router)
api.include_router(rewards_router)


@api.get("/health")
async def health():
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}


app.include_router(api)

# CORS — explicit origins (mobile clients use Bearer header, but web preview uses cookies)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL] if FRONTEND_URL != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.usage_events.create_index([("user_id", 1), ("started_at", -1)])
    await db.value_gate_sessions.create_index("session_id", unique=True)
    await db.value_gate_sessions.create_index([("user_id", 1), ("created_at", -1)])

    # Idempotent admin/test user seeding
    existing = await db.users.find_one({"email": ADMIN_EMAIL.lower()})
    if existing is None:
        await db.users.insert_one({
            "name": "Ansh Kumar",
            "email": ADMIN_EMAIL.lower(),
            "password_hash": hash_password(ADMIN_PASSWORD),
            "streak": 12,
            "longest_streak": 14,
            "focus_score": 82,
            "points": 850,
            "level": 4,
            "xp": 850,
            "goals": ["improve focus"],
            "blocked_apps": ["instagram", "youtube", "snapchat"],
            "intervention_sensitivity": "medium",
            "daily_screen_time_goal_min": 210,
            "focus_start_time": "06:30",
            "focus_end_time": "09:30",
            "last_active": datetime.now(timezone.utc),
            "created_at": datetime.now(timezone.utc),
            "role": "admin",
        })
        logger.info("Seeded demo user %s", ADMIN_EMAIL)
    elif not verify_password(ADMIN_PASSWORD, existing.get("password_hash", "")):
        await db.users.update_one(
            {"email": ADMIN_EMAIL.lower()},
            {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
        )
        logger.info("Updated demo user password for %s", ADMIN_EMAIL)


@app.on_event("shutdown")
async def on_shutdown():
    mongo_client.close()
