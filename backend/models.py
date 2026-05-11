"""Pydantic schemas for request/response validation."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


# ---------- Auth ----------
class SignupRequest(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    password: str = Field(min_length=4, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    id: str
    name: str
    email: EmailStr
    streak: int = 0
    focus_score: int = 0
    points: int = 0
    level: int = 1
    xp: int = 0
    goals: List[str] = []
    blocked_apps: List[str] = []
    created_at: datetime


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


# ---------- Profile ----------
class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    goals: Optional[List[str]] = None
    blocked_apps: Optional[List[str]] = None
    intervention_sensitivity: Optional[str] = None  # "soft" | "medium" | "strict"
    daily_screen_time_goal_min: Optional[int] = None
    focus_start_time: Optional[str] = None  # "06:30"
    focus_end_time: Optional[str] = None


# ---------- Analytics ----------
class UsageEvent(BaseModel):
    app_id: str  # e.g., "instagram"
    duration_min: float = Field(ge=0)
    started_at: datetime
    category: Optional[str] = "social"  # "productive" | "social" | "entertainment" | "other"


class DailyAnalytics(BaseModel):
    date: str  # YYYY-MM-DD
    total_minutes: float
    productive_minutes: float
    social_minutes: float
    entertainment_minutes: float
    other_minutes: float
    peak_hour: int  # 0-23
    peak_minutes: float
    risk_score: int  # 0-100
    risk_label: str  # "Low" | "Medium" | "High"
    hourly: List[Dict[str, Any]]  # [{hour, minutes, peak}]
    distribution: List[Dict[str, Any]]  # [{label, minutes, percent, color}]


# ---------- Value-Gate ----------
class DetectRiskRequest(BaseModel):
    app_id: str
    intent: Optional[str] = None  # "habit" | "work" | "social" | "other"
    time_of_day: Optional[int] = None  # hour 0-23


class DetectRiskResponse(BaseModel):
    risk_score: int  # 0-100
    risk_label: str
    intervene: bool
    session_id: str
    micro_task: Optional[Dict[str, Any]] = None
    timer_seconds: int = 60


class VerifyTaskRequest(BaseModel):
    session_id: str
    answer: str


class VerifyTaskResponse(BaseModel):
    success: bool
    feedback: str
    points_awarded: int = 0


class UnlockSessionRequest(BaseModel):
    session_id: str
    duration_minutes: int = 10


class UnlockSessionResponse(BaseModel):
    unlocked_until: datetime
    minutes_allowed: int
    completed_today: int
    target_today: int


# ---------- AI ----------
class GenerateTaskRequest(BaseModel):
    intent: Optional[str] = "habit"  # "habit" | "work" | "social" | "other"
    goal: Optional[str] = "improve focus"
    time_of_day: Optional[int] = None
    style: Optional[str] = None  # "summarize" | "reflect" | "mindfulness" | "priority"


class MicroTask(BaseModel):
    type: str  # "summarize" | "reflect" | "mindfulness" | "priority"
    prompt: str
    context: str
    suggested_answer: str


# ---------- Rewards ----------
class StreakResponse(BaseModel):
    streak: int
    longest_streak: int
    last_active: Optional[str]


class PointsResponse(BaseModel):
    points: int
    level: int
    xp: int
    xp_for_next_level: int
    badges: List[Dict[str, Any]]
