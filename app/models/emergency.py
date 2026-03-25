from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId


class EmergencyAlertModel(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    alert_type: str
    message: str
    location: Optional[str] = None
    is_resolved: bool = False
    resolved_at: Optional[datetime] = None
    notified_contacts: list = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
