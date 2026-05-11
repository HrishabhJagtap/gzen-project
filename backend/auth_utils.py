"""JWT token + bcrypt password helpers + FastAPI auth dependency."""
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Request, status
from bson import ObjectId
from typing import Optional

from config import JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRES_MIN, db


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRES_MIN),
        "iat": datetime.now(timezone.utc),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def _decode(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def _extract_token(request: Request) -> Optional[str]:
    # Bearer header first (mobile preferred), then httpOnly cookie
    auth_header = request.headers.get("Authorization", "")
    if auth_header.lower().startswith("bearer "):
        return auth_header.split(" ", 1)[1].strip()
    return request.cookies.get("access_token")


async def get_current_user(request: Request) -> dict:
    token = _extract_token(request)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    payload = _decode(token)
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")
    user_id = payload.get("sub")
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token subject")
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    user["id"] = str(user.pop("_id"))
    user.pop("password_hash", None)
    return user


def serialize_user(user_doc: dict) -> dict:
    """Convert a Mongo user document to UserPublic-shaped dict."""
    return {
        "id": str(user_doc.get("_id") or user_doc.get("id")),
        "name": user_doc.get("name", ""),
        "email": user_doc.get("email", ""),
        "streak": int(user_doc.get("streak", 0)),
        "focus_score": int(user_doc.get("focus_score", 0)),
        "points": int(user_doc.get("points", 0)),
        "level": int(user_doc.get("level", 1)),
        "xp": int(user_doc.get("xp", 0)),
        "goals": user_doc.get("goals", []) or [],
        "blocked_apps": user_doc.get("blocked_apps", []) or [],
        "created_at": user_doc.get("created_at", datetime.now(timezone.utc)),
    }
