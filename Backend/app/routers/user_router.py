from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse
from app.auth.dependencies import (
    get_current_user,
    require_role
)

from app.models.enums import UserRole

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get(
    "/me",
    response_model=UserResponse
)
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.get("/donor-only")
def donor_only(
    current_user: User = Depends(
        require_role(UserRole.DONOR)
    )
):
    return {
        "message": "Welcome donor!",
        "user": current_user.full_name,
        "role": current_user.role
    }