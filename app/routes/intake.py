from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime, timedelta
from bson import ObjectId
from app.schemas.intake import IntakeCreate, IntakeUpdate, IntakeResponse, AdherenceStats
from app.database import get_database
from app.utils.dependencies import get_current_active_user
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/intakes", tags=["Intake Tracking"])


@router.post("/", response_model=IntakeResponse, status_code=status.HTTP_201_CREATED)
async def create_intake(
    intake: IntakeCreate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    medicine = await db.medicines.find_one({
        "_id": ObjectId(intake.medicine_id),
        "user_id": str(current_user["_id"])
    })

    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    intake_data = intake.model_dump()
    intake_data["user_id"] = str(current_user["_id"])
    intake_data["created_at"] = datetime.utcnow()
    intake_data["updated_at"] = datetime.utcnow()

    result = await db.intakes.insert_one(intake_data)
    created_intake = await db.intakes.find_one({"_id": result.inserted_id})

    created_intake["id"] = str(created_intake.pop("_id"))
    return created_intake


@router.get("/", response_model=List[IntakeResponse])
async def get_intakes(
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database),
    start_date: str = None,
    end_date: str = None
):
    query = {"user_id": str(current_user["_id"])}

    if start_date and end_date:
        query["scheduled_time"] = {
            "$gte": datetime.fromisoformat(start_date),
            "$lte": datetime.fromisoformat(end_date)
        }

    intakes = await db.intakes.find(query).sort("scheduled_time", -1).to_list(length=None)

    for intake in intakes:
        intake["id"] = str(intake.pop("_id"))

    return intakes


@router.put("/{intake_id}", response_model=IntakeResponse)
async def update_intake(
    intake_id: str,
    intake_update: IntakeUpdate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    intake = await db.intakes.find_one({
        "_id": ObjectId(intake_id),
        "user_id": str(current_user["_id"])
    })

    if not intake:
        raise HTTPException(status_code=404, detail="Intake record not found")

    update_data = intake_update.model_dump()
    update_data["updated_at"] = datetime.utcnow()

    if intake_update.status == "missed" and intake.get("status") != "missed":
        medicine = await db.medicines.find_one({"_id": ObjectId(intake["medicine_id"])})
        notification_service = NotificationService(db)
        await notification_service.notify_contacts_missed_dose(
            str(current_user["_id"]),
            medicine.get("name", "Unknown medicine"),
            intake["scheduled_time"]
        )

    await db.intakes.update_one(
        {"_id": ObjectId(intake_id)},
        {"$set": update_data}
    )

    updated_intake = await db.intakes.find_one({"_id": ObjectId(intake_id)})
    updated_intake["id"] = str(updated_intake.pop("_id"))
    return updated_intake


@router.get("/adherence", response_model=AdherenceStats)
async def get_adherence_stats(
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database),
    days: int = 30
):
    start_date = datetime.utcnow() - timedelta(days=days)

    intakes = await db.intakes.find({
        "user_id": str(current_user["_id"]),
        "scheduled_time": {"$gte": start_date}
    }).to_list(length=None)

    total = len(intakes)
    taken = len([i for i in intakes if i.get("status") == "taken"])
    missed = len([i for i in intakes if i.get("status") == "missed"])
    adherence_rate = (taken / total * 100) if total > 0 else 0

    return {
        "total_scheduled": total,
        "taken": taken,
        "missed": missed,
        "adherence_rate": round(adherence_rate, 2)
    }
