from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId
from app.schemas.medicine import MedicineCreate, MedicineUpdate, MedicineResponse
from app.database import get_database
from app.utils.dependencies import get_current_active_user

router = APIRouter(prefix="/medicines", tags=["Medicines"])


@router.post("/", response_model=MedicineResponse, status_code=status.HTTP_201_CREATED)
async def create_medicine(
    medicine: MedicineCreate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    medicine_data = medicine.model_dump()
    medicine_data["user_id"] = str(current_user["_id"])
    medicine_data["is_active"] = True
    medicine_data["created_at"] = datetime.utcnow()
    medicine_data["updated_at"] = datetime.utcnow()

    result = await db.medicines.insert_one(medicine_data)
    created_medicine = await db.medicines.find_one({"_id": result.inserted_id})

    created_medicine["id"] = str(created_medicine.pop("_id"))
    return created_medicine


@router.get("/", response_model=List[MedicineResponse])
async def get_medicines(
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    medicines = await db.medicines.find({
        "user_id": str(current_user["_id"]),
        "is_active": True
    }).to_list(length=None)

    for medicine in medicines:
        medicine["id"] = str(medicine.pop("_id"))

    return medicines


@router.get("/{medicine_id}", response_model=MedicineResponse)
async def get_medicine(
    medicine_id: str,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    medicine = await db.medicines.find_one({
        "_id": ObjectId(medicine_id),
        "user_id": str(current_user["_id"])
    })

    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    medicine["id"] = str(medicine.pop("_id"))
    return medicine


@router.put("/{medicine_id}", response_model=MedicineResponse)
async def update_medicine(
    medicine_id: str,
    medicine_update: MedicineUpdate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    medicine = await db.medicines.find_one({
        "_id": ObjectId(medicine_id),
        "user_id": str(current_user["_id"])
    })

    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    update_data = {k: v for k, v in medicine_update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()

    await db.medicines.update_one(
        {"_id": ObjectId(medicine_id)},
        {"$set": update_data}
    )

    updated_medicine = await db.medicines.find_one({"_id": ObjectId(medicine_id)})
    updated_medicine["id"] = str(updated_medicine.pop("_id"))
    return updated_medicine


@router.delete("/{medicine_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_medicine(
    medicine_id: str,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    result = await db.medicines.update_one(
        {
            "_id": ObjectId(medicine_id),
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
        raise HTTPException(status_code=404, detail="Medicine not found")

    return None
