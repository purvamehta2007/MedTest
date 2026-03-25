from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from bson import ObjectId
from app.schemas.health_record import HealthRecordCreate, HealthRecordUpdate, HealthRecordResponse
from app.database import get_database
from app.utils.dependencies import get_current_active_user

router = APIRouter(prefix="/health-records", tags=["Health Records"])


@router.post("/", response_model=HealthRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_health_record(
    health_record: HealthRecordCreate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    existing_record = await db.health_records.find_one({"user_id": str(current_user["_id"])})

    if existing_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Health record already exists. Use PUT to update."
        )

    record_data = health_record.model_dump()
    record_data["user_id"] = str(current_user["_id"])
    record_data["created_at"] = datetime.utcnow()
    record_data["updated_at"] = datetime.utcnow()

    result = await db.health_records.insert_one(record_data)
    created_record = await db.health_records.find_one({"_id": result.inserted_id})

    created_record["id"] = str(created_record.pop("_id"))
    return created_record


@router.get("/", response_model=HealthRecordResponse)
async def get_health_record(
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    record = await db.health_records.find_one({"user_id": str(current_user["_id"])})

    if not record:
        raise HTTPException(status_code=404, detail="Health record not found")

    record["id"] = str(record.pop("_id"))
    return record


@router.put("/", response_model=HealthRecordResponse)
async def update_health_record(
    health_update: HealthRecordUpdate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    record = await db.health_records.find_one({"user_id": str(current_user["_id"])})

    if not record:
        raise HTTPException(status_code=404, detail="Health record not found")

    update_data = {k: v for k, v in health_update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()

    await db.health_records.update_one(
        {"user_id": str(current_user["_id"])},
        {"$set": update_data}
    )

    updated_record = await db.health_records.find_one({"user_id": str(current_user["_id"])})
    updated_record["id"] = str(updated_record.pop("_id"))
    return updated_record
