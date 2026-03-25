from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class HealthRecordCreate(BaseModel):
    allergies: Optional[List[str]] = []
    existing_conditions: Optional[List[str]] = []
    medical_history: Optional[str] = None
    blood_type: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    emergency_notes: Optional[str] = None


class HealthRecordUpdate(BaseModel):
    allergies: Optional[List[str]] = None
    existing_conditions: Optional[List[str]] = None
    medical_history: Optional[str] = None
    blood_type: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    emergency_notes: Optional[str] = None


class HealthRecordResponse(BaseModel):
    id: str
    user_id: str
    allergies: List[str]
    existing_conditions: List[str]
    medical_history: Optional[str] = None
    blood_type: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    emergency_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
