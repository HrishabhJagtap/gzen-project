"""Rewards routes — streak, points, badges."""
from fastapi import APIRouter, Depends
from datetime import datetime, timezone, timedelta
from bson import ObjectId

from config import db
from models import StreakResponse, PointsResponse
from auth_utils import get_current_user

router = APIRouter(prefix="/rewards", tags=["rewards"])

XP_PER_LEVEL = 300


def _badges(user: dict, completed_count: int) -> list:
    points = user.get("points", 0)
    streak = user.get("streak", 0)
    return [
        {"id": "early", "name": "Early Bird", "icon": "sunny", "color": "#F59E0B",
         "earned": streak >= 1},
        {"id": "focus", "name": "Focus Master", "icon": "scan", "color": "#22C55E",
         "earned": completed_count >= 5},
        {"id": "task", "name": "Task Crusher", "icon": "checkmark-done", "color": "#3B82F6",
         "earned": completed_count >= 10},
        {"id": "mindful", "name": "Mindful User", "icon": "leaf", "color": "#A855F7",
         "earned": points >= 500},
    ]


async def _refresh_streak(user_id: ObjectId) -> dict:
    """Increment streak if a value-gate was completed today and >24h since last."""
    user = await db.users.find_one({"_id": user_id})
    now = datetime.now(timezone.utc)
    last = user.get("last_active")
    # MongoDB strips tzinfo on read — re-attach UTC to keep comparisons consistent.
    if last is not None and last.tzinfo is None:
        last = last.replace(tzinfo=timezone.utc)
    streak = int(user.get("streak", 0))
    longest = int(user.get("longest_streak", 0))

    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    completed_today = await db.value_gate_sessions.count_documents({
        "user_id": user_id,
        "task_completed": True,
        "verified_at": {"$gte": start_of_day},
    })

    if completed_today > 0:
        if last is None or (last < start_of_day and last >= start_of_day - timedelta(days=1)):
            streak += 1
        elif last < start_of_day - timedelta(days=1):
            streak = 1
        longest = max(longest, streak)
        await db.users.update_one(
            {"_id": user_id},
            {"$set": {"streak": streak, "longest_streak": longest, "last_active": now}},
        )
        user["streak"] = streak
        user["longest_streak"] = longest
        user["last_active"] = now
    return user


@router.get("/streak", response_model=StreakResponse)
async def get_streak(user: dict = Depends(get_current_user)):
    fresh = await _refresh_streak(ObjectId(user["id"]))
    return {
        "streak": int(fresh.get("streak", 0)),
        "longest_streak": int(fresh.get("longest_streak", 0)),
        "last_active": (fresh.get("last_active") or datetime.now(timezone.utc)).isoformat(),
    }


@router.get("/points", response_model=PointsResponse)
async def get_points(user: dict = Depends(get_current_user)):
    fresh = await db.users.find_one({"_id": ObjectId(user["id"])})
    points = int(fresh.get("points", 0))
    xp = int(fresh.get("xp", 0))
    level = max(1, xp // XP_PER_LEVEL + 1)
    xp_for_next = level * XP_PER_LEVEL
    completed = await db.value_gate_sessions.count_documents({
        "user_id": ObjectId(user["id"]),
        "task_completed": True,
    })
    if int(fresh.get("level", 1)) != level:
        await db.users.update_one({"_id": ObjectId(user["id"])}, {"$set": {"level": level}})
    return {
        "points": points,
        "level": level,
        "xp": xp,
        "xp_for_next_level": xp_for_next,
        "badges": _badges(fresh, completed),
    }
