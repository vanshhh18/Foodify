from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user import User
from app.models.enums import UserRole

from app.auth.dependencies import require_role

from app.schemas.donation import (
    DonationCreate,
    DonationResponse
)

from app.services.donation_service import DonationService


router = APIRouter(
    prefix="/donations",
    tags=["Donations"]
)


@router.post(
    "",
    response_model=DonationResponse
)
def create_donation(
    donation: DonationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.DONOR)
    )
):
    return DonationService.create_donation(
        db=db,
        donation=donation,
        user_id=current_user.id
    )



@router.get(
    "",
    response_model=list[DonationResponse]
)
def get_my_donations(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.DONOR)
    )
):
    return DonationService.get_user_donations(
        db=db,
        user_id=current_user.id
    )