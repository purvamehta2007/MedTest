from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId


class FamilyContactModel(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    name: str
    relationship: str
    phone_number: str
    email: Optional[EmailStr] = None
    is_emergency_contact: bool = True
    notify_on_missed_dose: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
