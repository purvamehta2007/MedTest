import asyncio
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def seed_data():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]

    print("Clearing existing data...")
    await db.users.delete_many({})
    await db.medicines.delete_many({})
    await db.reminders.delete_many({})
    await db.intakes.delete_many({})
    await db.health_records.delete_many({})
    await db.family_contacts.delete_many({})
    await db.emergency_alerts.delete_many({})
    await db.notifications.delete_many({})

    print("Creating demo users...")
    users = [
        {
            "email": "john.doe@example.com",
            "full_name": "John Doe",
            "hashed_password": pwd_context.hash("password123"),
            "phone_number": "+1234567890",
            "date_of_birth": datetime(1985, 5, 15),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "email": "jane.smith@example.com",
            "full_name": "Jane Smith",
            "hashed_password": pwd_context.hash("password123"),
            "phone_number": "+1234567891",
            "date_of_birth": datetime(1990, 8, 20),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]

    result = await db.users.insert_many(users)
    user_ids = list(result.inserted_ids)

    print(f"Created {len(user_ids)} users")
    print(f"Demo user credentials:")
    print(f"  Email: john.doe@example.com, Password: password123")
    print(f"  Email: jane.smith@example.com, Password: password123")

    print("\nCreating medicines for users...")
    medicines = [
        {
            "user_id": str(user_ids[0]),
            "name": "Lisinopril",
            "description": "Blood pressure medication",
            "dosage": "10",
            "unit": "mg",
            "frequency": "daily",
            "form": "tablet",
            "manufacturer": "Generic Pharma",
            "expiry_date": datetime.utcnow() + timedelta(days=365),
            "instructions": "Take once daily in the morning",
            "side_effects": "Dizziness, dry cough",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "user_id": str(user_ids[0]),
            "name": "Metformin",
            "description": "Diabetes medication",
            "dosage": "500",
            "unit": "mg",
            "frequency": "twice daily",
            "form": "tablet",
            "manufacturer": "Generic Pharma",
            "expiry_date": datetime.utcnow() + timedelta(days=365),
            "instructions": "Take with meals",
            "side_effects": "Nausea, diarrhea",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "user_id": str(user_ids[1]),
            "name": "Levothyroxine",
            "description": "Thyroid medication",
            "dosage": "50",
            "unit": "mcg",
            "frequency": "daily",
            "form": "tablet",
            "manufacturer": "Generic Pharma",
            "expiry_date": datetime.utcnow() + timedelta(days=365),
            "instructions": "Take on empty stomach, 30 minutes before breakfast",
            "side_effects": "Weight changes, mood swings",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]

    result = await db.medicines.insert_many(medicines)
    medicine_ids = list(result.inserted_ids)
    print(f"Created {len(medicine_ids)} medicines")

    print("\nCreating reminders...")
    reminders = [
        {
            "user_id": str(user_ids[0]),
            "medicine_id": str(medicine_ids[0]),
            "reminder_times": ["08:00"],
            "frequency": "daily",
            "start_date": datetime.utcnow(),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "user_id": str(user_ids[0]),
            "medicine_id": str(medicine_ids[1]),
            "reminder_times": ["08:00", "20:00"],
            "frequency": "daily",
            "start_date": datetime.utcnow(),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "user_id": str(user_ids[1]),
            "medicine_id": str(medicine_ids[2]),
            "reminder_times": ["07:00"],
            "frequency": "daily",
            "start_date": datetime.utcnow(),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]

    result = await db.reminders.insert_many(reminders)
    print(f"Created {len(reminders)} reminders")

    print("\nCreating intake records...")
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    intakes = []

    for i in range(7):
        date = today - timedelta(days=i)
        intakes.extend([
            {
                "user_id": str(user_ids[0]),
                "medicine_id": str(medicine_ids[0]),
                "reminder_id": str(result.inserted_ids[0]),
                "scheduled_time": date.replace(hour=8),
                "actual_time": date.replace(hour=8, minute=15) if i < 6 else None,
                "status": "taken" if i < 6 else "missed",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "user_id": str(user_ids[0]),
                "medicine_id": str(medicine_ids[1]),
                "reminder_id": str(result.inserted_ids[1]),
                "scheduled_time": date.replace(hour=8),
                "actual_time": date.replace(hour=8, minute=10) if i < 5 else None,
                "status": "taken" if i < 5 else "missed",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ])

    result = await db.intakes.insert_many(intakes)
    print(f"Created {len(intakes)} intake records")

    print("\nCreating health records...")
    health_records = [
        {
            "user_id": str(user_ids[0]),
            "allergies": ["Penicillin", "Peanuts"],
            "existing_conditions": ["Hypertension", "Type 2 Diabetes"],
            "medical_history": "Diagnosed with hypertension in 2015, Type 2 diabetes in 2018",
            "blood_type": "O+",
            "height": 175.5,
            "weight": 82.0,
            "emergency_notes": "Call wife at +1234567892 in case of emergency",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "user_id": str(user_ids[1]),
            "allergies": ["Sulfa drugs"],
            "existing_conditions": ["Hypothyroidism"],
            "medical_history": "Diagnosed with hypothyroidism in 2019",
            "blood_type": "A+",
            "height": 165.0,
            "weight": 68.0,
            "emergency_notes": "Call husband at +1234567893 in case of emergency",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]

    await db.health_records.insert_many(health_records)
    print(f"Created {len(health_records)} health records")

    print("\nCreating family contacts...")
    family_contacts = [
        {
            "user_id": str(user_ids[0]),
            "name": "Mary Doe",
            "relationship": "Spouse",
            "phone_number": "+1234567892",
            "email": "mary.doe@example.com",
            "is_emergency_contact": True,
            "notify_on_missed_dose": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "user_id": str(user_ids[0]),
            "name": "Dr. Sarah Johnson",
            "relationship": "Primary Care Physician",
            "phone_number": "+1234567893",
            "email": "dr.johnson@example.com",
            "is_emergency_contact": True,
            "notify_on_missed_dose": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "user_id": str(user_ids[1]),
            "name": "Mike Smith",
            "relationship": "Spouse",
            "phone_number": "+1234567894",
            "email": "mike.smith@example.com",
            "is_emergency_contact": True,
            "notify_on_missed_dose": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]

    await db.family_contacts.insert_many(family_contacts)
    print(f"Created {len(family_contacts)} family contacts")

    print("\n✅ Demo data seeding completed successfully!")
    print("\nYou can now use the following credentials to test the API:")
    print("  Email: john.doe@example.com")
    print("  Password: password123")
    print("\n  Email: jane.smith@example.com")
    print("  Password: password123")

    client.close()


if __name__ == "__main__":
    asyncio.run(seed_data())
