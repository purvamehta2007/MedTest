from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class MedicineCreate(BaseModel):
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


class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    dosage: Optional[str] = None
    unit: Optional[str] = None
    frequency: Optional[str] = None
    form: Optional[str] = None
    manufacturer: Optional[str] = None
    expiry_date: Optional[datetime] = None
    instructions: Optional[str] = None
    side_effects: Optional[str] = None
    is_active: Optional[bool] = None


class MedicineResponse(BaseModel):
    id: str
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
    is_active: bool
    created_at: datetime
    updated_at: datetime
