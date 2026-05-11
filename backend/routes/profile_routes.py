"""Profile routes — get / update."""
from fastapi import APIRouter, Depends
from bson import ObjectId

from config import db
from models import ProfileUpdate, UserPublic
from auth_utils import get_current_user, serialize_user

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=UserPublic)
async def get_profile(user: dict = Depends(get_current_user)):
    return serialize_user(user)


@router.put("", response_model=UserPublic)
async def update_profile(payload: ProfileUpdate, user: dict = Depends(get_current_user)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if updates:
        await db.users.update_one({"_id": ObjectId(user["id"])}, {"$set": updates})
    fresh = await db.users.find_one({"_id": ObjectId(user["id"])})
    return serialize_user({**fresh, "_id": user["id"]})
