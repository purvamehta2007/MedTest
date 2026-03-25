from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId


class MedicineModel(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    name: str
    description: Optional[str] = None
    dosage: str
    unit: str
    frequency: str
    form: Optional[str] = None
    manufacturer: Optional[str] = None
    expiry_date: Optional[datetime] = None
    instructions: Optional[str] = None
    side_effects: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
