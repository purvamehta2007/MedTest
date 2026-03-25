from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId
from app.schemas.emergency import EmergencyAlertCreate, EmergencyAlertResponse
from app.database import get_database
from app.utils.dependencies import get_current_active_user
from app.services.emergency_service import EmergencyService

router = APIRouter(prefix="/emergency", tags=["Emergency"])


@router.post("/alert", response_model=EmergencyAlertResponse, status_code=status.HTTP_201_CREATED)
async def trigger_emergency_alert(
    alert: EmergencyAlertCreate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    emergency_service = EmergencyService(db)
    created_alert = await emergency_service.trigger_emergency_alert(
        user_id=str(current_user["_id"]),
        alert_type=alert.alert_type,
        message=alert.message,
        location=alert.location
    )

    created_alert["id"] = str(created_alert.pop("_id"))
    return created_alert


@router.get("/alerts", response_model=List[EmergencyAlertResponse])
async def get_emergency_alerts(
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    alerts = await db.emergency_alerts.find({
        "user_id": str(current_user["_id"])
    }).sort("created_at", -1).to_list(length=None)

    for alert in alerts:
        alert["id"] = str(alert.pop("_id"))

    return alerts


@router.put("/alerts/{alert_id}/resolve", response_model=EmergencyAlertResponse)
async def resolve_alert(
    alert_id: str,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_database)
):
    emergency_service = EmergencyService(db)
    resolved_alert = await emergency_service.resolve_emergency(
        alert_id=alert_id,
        user_id=str(current_user["_id"])
    )

    if not resolved_alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    resolved_alert["id"] = str(resolved_alert.pop("_id"))
    return resolved_alert
