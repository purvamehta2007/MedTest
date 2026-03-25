from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import connect_to_mongo, close_mongo_connection
from app.routes import auth, medicine, reminder, intake, health_record, family_contact, emergency


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(
    title="MedSync API",
    description="Medicine Awareness and Safety Application Backend",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(medicine.router)
app.include_router(reminder.router)
app.include_router(intake.router)
app.include_router(health_record.router)
app.include_router(family_contact.router)
app.include_router(emergency.router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to MedSync API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
