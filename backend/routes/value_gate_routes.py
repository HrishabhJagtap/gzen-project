"""Value-Gate routes — detect risk, verify task, unlock session."""
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import uuid

from config import db
from models import (
    DetectRiskRequest, DetectRiskResponse,
    VerifyTaskRequest, VerifyTaskResponse,
    UnlockSessionRequest, UnlockSessionResponse,
)
from auth_utils import get_current_user
from services.analytics_service import compute_risk
from services.ai_service import generate_micro_task

router = APIRouter(prefix="/value-gate", tags=["value-gate"])

DAILY_TARGET_GATES = 5  # Today's Progress target


@router.post("/detect-risk", response_model=DetectRiskResponse)
async def detect_risk(payload: DetectRiskRequest, user: dict = Depends(get_current_user)):
    user_id = ObjectId(user["id"])
    now = datetime.now(timezone.utc)
    # cumulative minutes today
    start_of_day = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
    cursor = db.usage_events.find({
        "user_id": user_id,
        "started_at": {"$gte": start_of_day},
    })
    today_events = await cursor.to_list(length=500)
    minutes_today = sum(float(e.get("duration_min", 0)) for e in today_events)

    tod = payload.time_of_day if payload.time_of_day is not None else now.hour
    risk_score, label = compute_risk(payload.app_id, payload.intent, tod, minutes_today)
    intervene = risk_score >= 50

    session_id = str(uuid.uuid4())
    session_doc = {
        "session_id": session_id,
        "user_id": user_id,
        "app_id": payload.app_id,
        "intent": payload.intent,
        "time_of_day": tod,
        "risk_score": risk_score,
        "risk_label": label,
        "intervene": intervene,
        "task": None,
        "task_completed": False,
        "unlocked_until": None,
        "created_at": now,
    }

    micro_task = None
    if intervene:
        # Choose the user's first goal (if any) for personalization
        goal = (user.get("goals") or ["improve focus"])[0]
        task = await generate_micro_task(
            intent=payload.intent or "habit",
            goal=goal,
            time_of_day=tod,
        )
        micro_task = task
        session_doc["task"] = task

    await db.value_gate_sessions.insert_one(session_doc)
    return {
        "risk_score": risk_score,
        "risk_label": label,
        "intervene": intervene,
        "session_id": session_id,
        "micro_task": micro_task,
        "timer_seconds": 60,
    }


@router.post("/verify-task", response_model=VerifyTaskResponse)
async def verify_task(payload: VerifyTaskRequest, user: dict = Depends(get_current_user)):
    sess = await db.value_gate_sessions.find_one(
        {"session_id": payload.session_id, "user_id": ObjectId(user["id"])}
    )
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")
    answer = (payload.answer or "").strip()
    # Hackathon-friendly verification: any non-empty answer of >= 3 chars is success.
    success = len(answer) >= 3
    points = 25 if success else 0
    await db.value_gate_sessions.update_one(
        {"session_id": payload.session_id},
        {"$set": {
            "task_completed": success,
            "user_answer": answer,
            "verified_at": datetime.now(timezone.utc),
        }},
    )
    if success:
        await db.users.update_one(
            {"_id": ObjectId(user["id"])},
            {"$inc": {"points": points, "xp": points}},
        )
    feedback = (
        "Great! You're all set. You can now use the app for 10 minutes."
        if success
        else "Please write a brief answer (at least 3 characters)."
    )
    return {"success": success, "feedback": feedback, "points_awarded": points}


@router.post("/unlock-session", response_model=UnlockSessionResponse)
async def unlock_session(payload: UnlockSessionRequest, user: dict = Depends(get_current_user)):
    user_id = ObjectId(user["id"])
    sess = await db.value_gate_sessions.find_one(
        {"session_id": payload.session_id, "user_id": user_id}
    )
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")
    if not sess.get("task_completed"):
        raise HTTPException(status_code=400, detail="Task not verified yet")
    minutes = max(1, min(60, payload.duration_minutes))
    until = datetime.now(timezone.utc) + timedelta(minutes=minutes)
    await db.value_gate_sessions.update_one(
        {"session_id": payload.session_id},
        {"$set": {"unlocked_until": until, "minutes_allowed": minutes}},
    )
    # count today's completed gates
    start_of_day = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    completed_today = await db.value_gate_sessions.count_documents({
        "user_id": user_id,
        "task_completed": True,
        "verified_at": {"$gte": start_of_day},
    })
    return {
        "unlocked_until": until,
        "minutes_allowed": minutes,
        "completed_today": completed_today,
        "target_today": DAILY_TARGET_GATES,
    }


@router.get("/history")
async def history(user: dict = Depends(get_current_user)):
    cursor = db.value_gate_sessions.find(
        {"user_id": ObjectId(user["id"])}, projection={"_id": 0, "user_id": 0}
    ).sort("created_at", -1).limit(20)
    items = await cursor.to_list(length=20)
    return {"items": items}
