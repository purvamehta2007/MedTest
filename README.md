# MedSync - Medicine Awareness and Safety Application Backend

A comprehensive backend API for managing medicines, reminders, health records, and emergency alerts built with FastAPI and MongoDB.

## Features

- **User Authentication**
  - JWT-based authentication
  - Google OAuth login support
  - Secure password hashing

- **Medicine Management**
  - Add, edit, delete, and view medicines
  - Track dosage, frequency, and expiry dates
  - Store instructions and side effects

- **Reminder System**
  - Set multiple daily reminder times
  - Daily/weekly frequency options
  - Active/inactive status management

- **Intake Tracking**
  - Mark doses as taken or missed
  - Track adherence history
  - View adherence statistics

- **Family Notifications**
  - Add emergency contacts
  - Automatic notifications for missed doses
  - Emergency contact management

- **Health Records**
  - Store allergies and existing conditions
  - Medical history tracking
  - Emergency notes

- **Emergency Alerts**
  - Trigger emergency notifications
  - Notify all emergency contacts
  - Track alert resolution

## Tech Stack

- **Framework**: FastAPI
- **Database**: MongoDB (with Motor async driver)
- **Authentication**: JWT + Google OAuth
- **Validation**: Pydantic
- **Password Hashing**: Passlib with bcrypt

## Project Structure

```
medsync-backend/
├── app/
│   ├── main.py                 # FastAPI application
│   ├── config.py               # Configuration settings
│   ├── database.py             # Database connection
│   ├── models/                 # Database models
│   │   ├── user.py
│   │   ├── medicine.py
│   │   ├── reminder.py
│   │   ├── intake.py
│   │   ├── health_record.py
│   │   ├── family_contact.py
│   │   └── emergency.py
│   ├── schemas/                # Pydantic schemas
│   │   ├── user.py
│   │   ├── medicine.py
│   │   ├── reminder.py
│   │   ├── intake.py
│   │   ├── health_record.py
│   │   ├── family_contact.py
│   │   └── emergency.py
│   ├── routes/                 # API routes
│   │   ├── auth.py
│   │   ├── medicine.py
│   │   ├── reminder.py
│   │   ├── intake.py
│   │   ├── health_record.py
│   │   ├── family_contact.py
│   │   └── emergency.py
│   ├── services/               # Business logic
│   │   ├── auth_service.py
│   │   ├── notification_service.py
│   │   └── emergency_service.py
│   └── utils/                  # Utilities
│       ├── security.py
│       └── dependencies.py
├── scripts/
│   └── seed_demo_data.py       # Demo data seeding
├── requirements.txt
├── .env.example
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- MongoDB 4.4+
- pip

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd medsync-backend
```

2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=medsync
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

5. Start MongoDB
```bash
mongod --dbpath /path/to/your/data/directory
```

6. Seed demo data (optional)
```bash
python scripts/seed_demo_data.py
```

7. Run the application
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login with email and password |
| POST | `/auth/google-login` | Login with Google |
| GET | `/auth/me` | Get current user info |

### Medicines

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/medicines` | Create a new medicine |
| GET | `/medicines` | Get all medicines |
| GET | `/medicines/{id}` | Get medicine by ID |
| PUT | `/medicines/{id}` | Update medicine |
| DELETE | `/medicines/{id}` | Delete medicine (soft delete) |

### Reminders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reminders` | Create a new reminder |
| GET | `/reminders` | Get all reminders |
| GET | `/reminders/{id}` | Get reminder by ID |
| PUT | `/reminders/{id}` | Update reminder |
| DELETE | `/reminders/{id}` | Delete reminder |

### Intake Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/intakes` | Create intake record |
| GET | `/intakes` | Get intake records |
| PUT | `/intakes/{id}` | Update intake status |
| GET | `/intakes/adherence` | Get adherence statistics |

### Health Records

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/health-records` | Create health record |
| GET | `/health-records` | Get health record |
| PUT | `/health-records` | Update health record |

### Family Contacts

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/family-contacts` | Add family contact |
| GET | `/family-contacts` | Get all contacts |
| GET | `/family-contacts/{id}` | Get contact by ID |
| PUT | `/family-contacts/{id}` | Update contact |
| DELETE | `/family-contacts/{id}` | Delete contact |

### Emergency

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/emergency/alert` | Trigger emergency alert |
| GET | `/emergency/alerts` | Get all alerts |
| PUT | `/emergency/alerts/{id}/resolve` | Resolve alert |

## Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "email": "string",
  "full_name": "string",
  "hashed_password": "string",
  "google_id": "string (optional)",
  "phone_number": "string (optional)",
  "date_of_birth": "datetime (optional)",
  "is_active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Medicines Collection
```json
{
  "_id": "ObjectId",
  "user_id": "string",
  "name": "string",
  "description": "string",
  "dosage": "string",
  "unit": "string",
  "frequency": "string",
  "form": "string",
  "manufacturer": "string",
  "expiry_date": "datetime",
  "instructions": "string",
  "side_effects": "string",
  "is_active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Reminders Collection
```json
{
  "_id": "ObjectId",
  "user_id": "string",
  "medicine_id": "string",
  "reminder_times": ["string"],
  "frequency": "string",
  "days_of_week": ["int"] (optional),
  "start_date": "datetime",
  "end_date": "datetime (optional)",
  "is_active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Intakes Collection
```json
{
  "_id": "ObjectId",
  "user_id": "string",
  "medicine_id": "string",
  "reminder_id": "string (optional)",
  "scheduled_time": "datetime",
  "actual_time": "datetime (optional)",
  "status": "string (taken/missed)",
  "notes": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Health Records Collection
```json
{
  "_id": "ObjectId",
  "user_id": "string",
  "allergies": ["string"],
  "existing_conditions": ["string"],
  "medical_history": "string",
  "blood_type": "string",
  "height": "float",
  "weight": "float",
  "emergency_notes": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Family Contacts Collection
```json
{
  "_id": "ObjectId",
  "user_id": "string",
  "name": "string",
  "relationship": "string",
  "phone_number": "string",
  "email": "string",
  "is_emergency_contact": "boolean",
  "notify_on_missed_dose": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Emergency Alerts Collection
```json
{
  "_id": "ObjectId",
  "user_id": "string",
  "alert_type": "string",
  "message": "string",
  "location": "string",
  "is_resolved": "boolean",
  "resolved_at": "datetime",
  "notified_contacts": ["string"],
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## Sample Requests and Responses

### 1. User Signup

**Request:**
```bash
POST /auth/signup
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123",
  "full_name": "John Doe",
  "phone_number": "+1234567890"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 2. Login

**Request:**
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. Create Medicine

**Request:**
```bash
POST /medicines
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Aspirin",
  "description": "Pain reliever",
  "dosage": "500",
  "unit": "mg",
  "frequency": "as needed",
  "form": "tablet",
  "manufacturer": "Generic Pharma",
  "instructions": "Take with food",
  "side_effects": "Stomach upset"
}
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "user_id": "507f1f77bcf86cd799439012",
  "name": "Aspirin",
  "description": "Pain reliever",
  "dosage": "500",
  "unit": "mg",
  "frequency": "as needed",
  "form": "tablet",
  "manufacturer": "Generic Pharma",
  "expiry_date": null,
  "instructions": "Take with food",
  "side_effects": "Stomach upset",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### 4. Create Reminder

**Request:**
```bash
POST /reminders
Authorization: Bearer <token>
Content-Type: application/json

{
  "medicine_id": "507f1f77bcf86cd799439011",
  "reminder_times": ["08:00", "20:00"],
  "frequency": "daily",
  "start_date": "2024-01-01T00:00:00Z"
}
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439013",
  "user_id": "507f1f77bcf86cd799439012",
  "medicine_id": "507f1f77bcf86cd799439011",
  "reminder_times": ["08:00", "20:00"],
  "frequency": "daily",
  "days_of_week": null,
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": null,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### 5. Mark Intake

**Request:**
```bash
PUT /intakes/507f1f77bcf86cd799439014
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "taken",
  "actual_time": "2024-01-01T08:15:00Z",
  "notes": "Took with breakfast"
}
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439014",
  "user_id": "507f1f77bcf86cd799439012",
  "medicine_id": "507f1f77bcf86cd799439011",
  "reminder_id": "507f1f77bcf86cd799439013",
  "scheduled_time": "2024-01-01T08:00:00Z",
  "actual_time": "2024-01-01T08:15:00Z",
  "status": "taken",
  "notes": "Took with breakfast",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T08:15:00Z"
}
```

## Demo Credentials

After running the seed script, you can use these credentials:

**User 1:**
- Email: `john.doe@example.com`
- Password: `password123`

**User 2:**
- Email: `jane.smith@example.com`
- Password: `password123`

## Postman Collection

Import `postman_collection.json` into Postman to test all API endpoints. The collection includes:
- All endpoints with sample requests
- Automatic token management
- Environment variables setup

## Future Enhancements (AI Integration Ready)

The current architecture is designed to easily integrate:

- **Medicine Image Recognition**: Add endpoints to upload medicine images
- **AI Explanations**: Integration points for AI-powered medicine explanations
- **Health Analysis**: Data structure supports AI-driven health insights
- **Smart Notifications**: Framework ready for intelligent notification scheduling
- **Drug Interaction Warnings**: Schema supports additional safety features

## Notification System

Currently, notifications are stored in the database. To enable actual email/SMS:

1. Add email service (SendGrid, AWS SES)
2. Add SMS service (Twilio, AWS SNS)
3. Update `notification_service.py` to send actual notifications

## Security Best Practices

- Passwords are hashed using bcrypt
- JWT tokens expire after 30 minutes
- All endpoints (except auth) require authentication
- CORS is enabled (configure for production)
- Environment variables for sensitive data

## Testing

To test the API:

1. Start the server
2. Visit http://localhost:8000/docs
3. Click "Authorize" and login to get a token
4. Use the interactive documentation to test endpoints

Or import the Postman collection for easier testing.

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.
