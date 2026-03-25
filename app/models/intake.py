from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId


class IntakeModel(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    medicine_id: str
    reminder_id: Optional[str] = None
    scheduled_time: datetime
    actual_time: Optional[datetime] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
