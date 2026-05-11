"""AI routes — generate-task on demand."""
from fastapi import APIRouter, Depends
from datetime import datetime, timezone

from models import GenerateTaskRequest, MicroTask
from auth_utils import get_current_user
from services.ai_service import generate_micro_task

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/generate-task", response_model=MicroTask)
async def generate_task(payload: GenerateTaskRequest, user: dict = Depends(get_current_user)):
    tod = payload.time_of_day if payload.time_of_day is not None else datetime.now(timezone.utc).hour
    task = await generate_micro_task(
        intent=payload.intent or "habit",
        goal=payload.goal or (user.get("goals") or ["improve focus"])[0],
        time_of_day=tod,
        style=payload.style,
    )
    return task
