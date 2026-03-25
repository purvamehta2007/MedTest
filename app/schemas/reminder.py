from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class ReminderCreate(BaseModel):
    medicine_id: str
    reminder_times: List[str]
    frequency: str
    days_of_week: Optional[List[int]] = None
    start_date: datetime
    end_date: Optional[datetime] = None


class ReminderUpdate(BaseModel):
    reminder_times: Optional[List[str]] = None
    frequency: Optional[str] = None
    days_of_week: Optional[List[int]] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: Optional[bool] = None


class ReminderResponse(BaseModel):
    id: str
    user_id: str
    medicine_id: str
    reminder_times: List[str]
    frequency: str
    days_of_week: Optional[List[int]] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime
