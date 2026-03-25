from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from bson import ObjectId


class HealthRecordModel(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    allergies: Optional[List[str]] = []
    existing_conditions: Optional[List[str]] = []
    medical_history: Optional[str] = None
    blood_type: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    emergency_notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
