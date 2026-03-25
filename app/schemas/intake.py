from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class IntakeCreate(BaseModel):
    medicine_id: str
    reminder_id: Optional[str] = None
    scheduled_time: datetime
    status: str
    notes: Optional[str] = None


class IntakeUpdate(BaseModel):
    actual_time: Optional[datetime] = None
    status: str
    notes: Optional[str] = None


class IntakeResponse(BaseModel):
    id: str
    user_id: str
    medicine_id: str
    reminder_id: Optional[str] = None
    scheduled_time: datetime
    actual_time: Optional[datetime] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class AdherenceStats(BaseModel):
    total_scheduled: int
    taken: int
    missed: int
    adherence_rate: float
