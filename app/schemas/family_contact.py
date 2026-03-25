from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class FamilyContactCreate(BaseModel):
    name: str
    relationship: str
    phone_number: str
    email: Optional[EmailStr] = None
    is_emergency_contact: bool = True
    notify_on_missed_dose: bool = True


class FamilyContactUpdate(BaseModel):
    name: Optional[str] = None
    relationship: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[EmailStr] = None
    is_emergency_contact: Optional[bool] = None
    notify_on_missed_dose: Optional[bool] = None


class FamilyContactResponse(BaseModel):
    id: str
    user_id: str
    name: str
    relationship: str
    phone_number: str
    email: Optional[EmailStr] = None
    is_emergency_contact: bool
    notify_on_missed_dose: bool
    created_at: datetime
    updated_at: datetime
