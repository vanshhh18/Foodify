from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user import User
from app.models.enums import UserRole

from app.auth.dependencies import (
        require_role,
        require_verified_role
    )

from app.schemas.donation import (
    DonationCreate,
    DonationResponse,
    DonationUpdate
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


@router.get(
    "/available",
    response_model=list[DonationResponse]
)
def get_available_donations(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_verified_role(
            UserRole.NGO,
            UserRole.VOLUNTEER
        )
    )
):
    return DonationService.get_available_donations(
        db=db
    )


@router.get(
        "/available/{donation_id}",
        response_model=DonationResponse
)
def get_available_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_verified_role(
            UserRole.NGO,
            UserRole.VOLUNTEER
        )
    )

):
    donation = DonationService.get_available_donation_by_id(
        db=db,
        donation_id=donation_id
    )


    if donation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )

    return donation


@router.post(
    "/my-claimed/{donation_id}/complete"
)
def complete_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_verified_role(
            UserRole.NGO,
            UserRole.VOLUNTEER
        )
    )
):
    donation = DonationService.complete_donation(
        db=db,
        donation_id=donation_id,
        user_id=current_user.id
    )

    if donation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found or not claimed by you"
        )

    return {
        "message": "Donation completed successfully"
    }


@router.post(
    "/available/{donation_id}/claim",
    response_model=DonationResponse
)
def claim_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_verified_role(
            UserRole.NGO,
            UserRole.VOLUNTEER
        )
    )
):
    donation = DonationService.claim_donation(
        db=db,
        donation_id=donation_id,
        user_id=current_user.id
    )

    if donation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found or already claimed"
        )

    return donation

@router.get(
    "/my-claimed",
    response_model=list[DonationResponse]
)
def get_my_claimed_donations(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_verified_role(
            UserRole.NGO,
            UserRole.VOLUNTEER
        )
    )
):
    return DonationService.get_my_claimed_donations(
        db=db,
        user_id=current_user.id
    )

@router.get(
    "/my-completed",
    response_model=list[DonationResponse]
)
def get_my_completed_donations(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_verified_role(
            UserRole.NGO,
            UserRole.VOLUNTEER
        )
    )
):
    return DonationService.get_my_completed_donations(
        db=db,
        user_id=current_user.id
    )


@router.get(
    "/{donation_id}",
    response_model=DonationResponse
)
def get_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.DONOR)
    )
):
    donation = DonationService.get_donation_by_id(
        db=db,
        donation_id=donation_id,
        user_id=current_user.id
    )

    if donation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )

    return donation



@router.patch(
    "/{donation_id}",
    response_model=DonationResponse
)
def update_donation(
    donation_id: int,
    donation_data: DonationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.DONOR)
    )
):
    donation = DonationService.update_donation(
        db=db,
        donation_id=donation_id,
        user_id=current_user.id,
        donation_data=donation_data
    )

    if donation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )

    return donation



@router.delete("/{donation_id}")
def delete_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.DONOR)
    )
):
    donation = DonationService.delete_donation(
        db=db,
        donation_id=donation_id,
        user_id=current_user.id
    )

    if donation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )

    return {
        "message": "Donation deleted successfully"
    }



