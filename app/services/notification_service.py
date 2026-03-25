from datetime import datetime
from typing import List


class NotificationService:
    def __init__(self, db):
        self.db = db

    async def notify_contacts_missed_dose(self, user_id: str, medicine_name: str, scheduled_time: datetime):
        contacts = await self.db.family_contacts.find({
            "user_id": user_id,
            "notify_on_missed_dose": True
        }).to_list(length=None)

        user = await self.db.users.find_one({"_id": user_id})

        notifications = []
        for contact in contacts:
            notification = {
                "contact_id": str(contact["_id"]),
                "contact_name": contact["name"],
                "contact_phone": contact["phone_number"],
                "contact_email": contact.get("email"),
                "notification_type": "missed_dose",
                "message": f"{user.get('full_name', 'User')} missed their {medicine_name} dose scheduled at {scheduled_time}",
                "status": "pending",
                "created_at": datetime.utcnow()
            }
            notifications.append(notification)

            await self.db.notifications.insert_one(notification)

        return notifications

    async def notify_emergency_contacts(self, user_id: str, alert_type: str, message: str, location: str = None):
        contacts = await self.db.family_contacts.find({
            "user_id": user_id,
            "is_emergency_contact": True
        }).to_list(length=None)

        user = await self.db.users.find_one({"_id": user_id})

        notifications = []
        for contact in contacts:
            notification = {
                "contact_id": str(contact["_id"]),
                "contact_name": contact["name"],
                "contact_phone": contact["phone_number"],
                "contact_email": contact.get("email"),
                "notification_type": "emergency",
                "alert_type": alert_type,
                "message": f"EMERGENCY: {user.get('full_name', 'User')} - {message}",
                "location": location,
                "status": "pending",
                "created_at": datetime.utcnow()
            }
            notifications.append(notification)

            await self.db.notifications.insert_one(notification)

        return [str(contact["_id"]) for contact in contacts]
