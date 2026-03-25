from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId
from app.schemas.family_contact import FamilyContactCreate, FamilyContactUpdate, FamilyContactResponse
from app.database import get_database
from app.utils.dependencies import get_current_active_user

router = APIRouter(prefix="/family-contacts", tags=["Family Contacts"])


@router.post("/", response_model=FamilyContactResponse, status_code=status.HTTP_201_CREATED)
async def create_family_contact(
    contact: FamilyContactCreate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    contact_data = contact.model_dump()
    contact_data["user_id"] = str(current_user["_id"])
    contact_data["created_at"] = datetime.utcnow()
    contact_data["updated_at"] = datetime.utcnow()

    result = await db.family_contacts.insert_one(contact_data)
    created_contact = await db.family_contacts.find_one({"_id": result.inserted_id})

    created_contact["id"] = str(created_contact.pop("_id"))
    return created_contact


@router.get("/", response_model=List[FamilyContactResponse])
async def get_family_contacts(
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    contacts = await db.family_contacts.find({
        "user_id": str(current_user["_id"])
    }).to_list(length=None)

    for contact in contacts:
        contact["id"] = str(contact.pop("_id"))

    return contacts


@router.get("/{contact_id}", response_model=FamilyContactResponse)
async def get_family_contact(
    contact_id: str,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    contact = await db.family_contacts.find_one({
        "_id": ObjectId(contact_id),
        "user_id": str(current_user["_id"])
    })

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    contact["id"] = str(contact.pop("_id"))
    return contact


@router.put("/{contact_id}", response_model=FamilyContactResponse)
async def update_family_contact(
    contact_id: str,
    contact_update: FamilyContactUpdate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    contact = await db.family_contacts.find_one({
        "_id": ObjectId(contact_id),
        "user_id": str(current_user["_id"])
    })

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    update_data = {k: v for k, v in contact_update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()

    await db.family_contacts.update_one(
        {"_id": ObjectId(contact_id)},
        {"$set": update_data}
    )

    updated_contact = await db.family_contacts.find_one({"_id": ObjectId(contact_id)})
    updated_contact["id"] = str(updated_contact.pop("_id"))
    return updated_contact


@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_family_contact(
    contact_id: str,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    result = await db.family_contacts.delete_one({
        "_id": ObjectId(contact_id),
        "user_id": str(current_user["_id"])
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")

    return None
