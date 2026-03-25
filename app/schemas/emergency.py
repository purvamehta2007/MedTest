from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class EmergencyAlertCreate(BaseModel):
    alert_type: str
    message: str
    location: Optional[str] = None


class EmergencyAlertResponse(BaseModel):
    id: str
    user_id: str
    alert_type: str
    message: str
    location: Optional[str] = None
    is_resolved: bool
    resolved_at: Optional[datetime] = None
    notified_contacts: List[str]
    created_at: datetime
    updated_at: datetime


class NotificationRecord(BaseModel):
    contact_id: str
    contact_name: str
    contact_phone: str
    notification_status: str
    sent_at: datetime
