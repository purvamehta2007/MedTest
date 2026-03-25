from datetime import datetime
from bson import ObjectId
from app.services.notification_service import NotificationService


class EmergencyService:
    def __init__(self, db):
        self.db = db
        self.notification_service = NotificationService(db)

    async def trigger_emergency_alert(self, user_id: str, alert_type: str, message: str, location: str = None):
        notified_contacts = await self.notification_service.notify_emergency_contacts(
            user_id, alert_type, message, location
        )

        alert_data = {
            "user_id": user_id,
            "alert_type": alert_type,
            "message": message,
            "location": location,
            "is_resolved": False,
            "notified_contacts": notified_contacts,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = await self.db.emergency_alerts.insert_one(alert_data)
        alert = await self.db.emergency_alerts.find_one({"_id": result.inserted_id})

        return alert

    async def resolve_emergency(self, alert_id: str, user_id: str):
        alert = await self.db.emergency_alerts.find_one({
            "_id": ObjectId(alert_id),
            "user_id": user_id
        })

        if not alert:
            return None

        update_data = {
            "is_resolved": True,
            "resolved_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        await self.db.emergency_alerts.update_one(
            {"_id": ObjectId(alert_id)},
            {"$set": update_data}
        )

        return await self.db.emergency_alerts.find_one({"_id": ObjectId(alert_id)})
