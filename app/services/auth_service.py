from datetime import datetime
from typing import Optional
from fastapi import HTTPException, status
from google.oauth2 import id_token
from google.auth.transport import requests
from app.utils.security import verify_password, get_password_hash, create_access_token
from app.config import settings
from bson import ObjectId


class AuthService:
    def __init__(self, db):
        self.db = db

    async def create_user(self, email: str, password: str, full_name: str, phone_number: Optional[str] = None, date_of_birth: Optional[datetime] = None):
        existing_user = await self.db.users.find_one({"email": email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        hashed_password = get_password_hash(password)
        user_data = {
            "email": email,
            "hashed_password": hashed_password,
            "full_name": full_name,
            "phone_number": phone_number,
            "date_of_birth": date_of_birth,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = await self.db.users.insert_one(user_data)
        user = await self.db.users.find_one({"_id": result.inserted_id})

        access_token = create_access_token(data={"sub": user["email"]})
        return {"access_token": access_token, "token_type": "bearer"}

    async def authenticate_user(self, email: str, password: str):
        user = await self.db.users.find_one({"email": email})
        if not user or not verify_password(password, user.get("hashed_password", "")):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_access_token(data={"sub": user["email"]})
        return {"access_token": access_token, "token_type": "bearer"}

    async def google_login(self, token: str):
        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

            email = idinfo.get("email")
            name = idinfo.get("name")
            google_id = idinfo.get("sub")

            user = await self.db.users.find_one({"email": email})

            if not user:
                user_data = {
                    "email": email,
                    "full_name": name,
                    "google_id": google_id,
                    "is_active": True,
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
                result = await self.db.users.insert_one(user_data)
                user = await self.db.users.find_one({"_id": result.inserted_id})

            access_token = create_access_token(data={"sub": user["email"]})
            return {"access_token": access_token, "token_type": "bearer"}

        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token"
            )
