from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserCreate, UserLogin, GoogleLogin, Token, UserResponse
from app.services.auth_service import AuthService
from app.database import get_database
from app.utils.dependencies import get_current_active_user
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db=Depends(get_database)):
    auth_service = AuthService(db)
    return await auth_service.create_user(
        email=user.email,
        password=user.password,
        full_name=user.full_name,
        phone_number=user.phone_number,
        date_of_birth=user.date_of_birth
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db=Depends(get_database)):
    auth_service = AuthService(db)
    return await auth_service.authenticate_user(
        email=credentials.email,
        password=credentials.password
    )


@router.post("/google-login", response_model=Token)
async def google_login(google_token: GoogleLogin, db=Depends(get_database)):
    auth_service = AuthService(db)
    return await auth_service.google_login(token=google_token.token)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_active_user)):
    return {
        "id": str(current_user["_id"]),
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "phone_number": current_user.get("phone_number"),
        "date_of_birth": current_user.get("date_of_birth"),
        "is_active": current_user.get("is_active", True),
        "created_at": current_user["created_at"]
    }
