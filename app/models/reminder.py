from datetime import datetime, time
from typing import Optional, List
from pydantic import BaseModel, Field
from bson import ObjectId


class ReminderModel(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    medicine_id: str
    reminder_times: List[str]
    frequency: str
    days_of_week: Optional[List[int]] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
