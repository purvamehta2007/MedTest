from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId
from app.schemas.reminder import ReminderCreate, ReminderUpdate, ReminderResponse
from app.database import get_database
from app.utils.dependencies import get_current_active_user

router = APIRouter(prefix="/reminders", tags=["Reminders"])


@router.post("/", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
async def create_reminder(
    reminder: ReminderCreate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    medicine = await db.medicines.find_one({
        "_id": ObjectId(reminder.medicine_id),
        "user_id": str(current_user["_id"])
    })

    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    reminder_data = reminder.model_dump()
    reminder_data["user_id"] = str(current_user["_id"])
    reminder_data["is_active"] = True
    reminder_data["created_at"] = datetime.utcnow()
    reminder_data["updated_at"] = datetime.utcnow()

    result = await db.reminders.insert_one(reminder_data)
    created_reminder = await db.reminders.find_one({"_id": result.inserted_id})

    created_reminder["id"] = str(created_reminder.pop("_id"))
    return created_reminder


@router.get("/", response_model=List[ReminderResponse])
async def get_reminders(
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    reminders = await db.reminders.find({
        "user_id": str(current_user["_id"]),
        "is_active": True
    }).to_list(length=None)

    for reminder in reminders:
        reminder["id"] = str(reminder.pop("_id"))

    return reminders


@router.get("/{reminder_id}", response_model=ReminderResponse)
async def get_reminder(
    reminder_id: str,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    reminder = await db.reminders.find_one({
        "_id": ObjectId(reminder_id),
        "user_id": str(current_user["_id"])
    })

    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")

    reminder["id"] = str(reminder.pop("_id"))
    return reminder


@router.put("/{reminder_id}", response_model=ReminderResponse)
async def update_reminder(
    reminder_id: str,
    reminder_update: ReminderUpdate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    reminder = await db.reminders.find_one({
        "_id": ObjectId(reminder_id),
        "user_id": str(current_user["_id"])
    })

    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")

    update_data = {k: v for k, v in reminder_update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()

    await db.reminders.update_one(
        {"_id": ObjectId(reminder_id)},
        {"$set": update_data}
    )

    updated_reminder = await db.reminders.find_one({"_id": ObjectId(reminder_id)})
    updated_reminder["id"] = str(updated_reminder.pop("_id"))
    return updated_reminder


@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reminder(
    reminder_id: str,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    result = await db.reminders.update_one(
        {
            "_id": ObjectId(reminder_id),
            "user_id": str(current_user["_id"])
        },
        {
            "$set": {
                "is_active": False,
                "updated_at": datetime.utcnow()
            }
        }
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Reminder not found")

    return None
