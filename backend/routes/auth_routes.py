"""Auth routes — signup, login, me, logout."""
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from datetime import datetime, timezone
from bson import ObjectId

from config import db
from models import SignupRequest, LoginRequest, AuthResponse, UserPublic
from auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    serialize_user,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def _new_user_doc(name: str, email: str, password: str) -> dict:
    return {
        "name": name.strip(),
        "email": email.strip().lower(),
        "password_hash": hash_password(password),
        "streak": 0,
        "longest_streak": 0,
        "focus_score": 75,  # starts neutral-positive
        "points": 0,
        "level": 1,
        "xp": 0,
        "goals": [],
        "blocked_apps": ["instagram", "youtube"],
        "intervention_sensitivity": "medium",
        "daily_screen_time_goal_min": 210,  # 3h 30m
        "focus_start_time": "06:30",
        "focus_end_time": "09:30",
        "last_active": None,
        "created_at": datetime.now(timezone.utc),
    }


@router.post("/signup", response_model=AuthResponse)
async def signup(payload: SignupRequest, response: Response):
    email = payload.email.lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    doc = _new_user_doc(payload.name, payload.email, payload.password)
    result = await db.users.insert_one(doc)
    user_id = str(result.inserted_id)
    token = create_access_token(user_id, email)
    response.set_cookie(
        "access_token", token, httponly=True, samesite="lax", max_age=60 * 60 * 24 * 7, path="/"
    )
    user_public = serialize_user({**doc, "_id": user_id})
    return {"access_token": token, "token_type": "bearer", "user": user_public}


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, response: Response):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    user_id = str(user["_id"])
    token = create_access_token(user_id, email)
    response.set_cookie(
        "access_token", token, httponly=True, samesite="lax", max_age=60 * 60 * 24 * 7, path="/"
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": serialize_user({**user, "_id": user_id}),
    }


@router.get("/me", response_model=UserPublic)
async def me(user: dict = Depends(get_current_user)):
    return serialize_user(user)


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"message": "logged out"}
