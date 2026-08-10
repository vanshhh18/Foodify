import os
import uuid

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
    status
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.enums import UserRole
from app.auth.dependencies import require_role

from app.services.verification_service import VerificationService
from app.schemas.verification import VerificationResponse

from app.models.verification import VerificationRequest

from datetime import datetime

router = APIRouter(
    prefix="/verification",
    tags=["Verification"]
)


@router.post(
    "/request",
    response_model=VerificationResponse
)
async def create_verification_request(
    organization_name: str = Form(...),
    registration_number: str = Form(...),
    document: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            UserRole.NGO,
            UserRole.VOLUNTEER
        )
    )
):

    # Check if already verified
    if current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already verified"
        )

    # Allow common verification documents
    allowed_types = {
        "application/pdf",
        "image/jpeg",
        "image/png"
    }

    if document.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF, JPG and PNG files are allowed"
        )

    # Read uploaded document
    document_data = await document.read()

    # Create upload directory
    upload_dir = "uploads/verification"

    os.makedirs(
        upload_dir,
        exist_ok=True
    )

    # Generate unique filename
    extension = os.path.splitext(
        document.filename
    )[1]

    filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(
        upload_dir,
        filename
    )

    # Save document
    with open(file_path, "wb") as buffer:
        buffer.write(document_data)

    try:

        verification = VerificationService.create_request(
            db=db,
            user_id=current_user.id,
            organization_name=organization_name,
            registration_number=registration_number,
            document=file_path
        )

        return verification

    except Exception:
        # Remove file if database operation fails
        if os.path.exists(file_path):
            os.remove(file_path)

        raise


@router.get(
    "/pending",
    response_model=list[VerificationResponse]
)
def get_pending_verifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    )
):
    return (
        db.query(VerificationRequest)
        .filter(
            VerificationRequest.status == "PENDING"
        )
        .order_by(
            VerificationRequest.created_at.desc()
        )
        .all()
    )


@router.post("/{request_id}/approve")
def approve_verification(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    )
):
    verification = (
        db.query(VerificationRequest)
        .filter(
            VerificationRequest.id == request_id,
            VerificationRequest.status == "PENDING"
        )
        .first()
    )

    if verification is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification request not found"
        )

    user = (
        db.query(User)
        .filter(User.id == verification.user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    verification.status = "APPROVED"
    verification.reviewed_at = datetime.utcnow()

    user.is_verified = True

    db.commit()

    return {
        "message": "Verification approved successfully"
    }


@router.post("/{request_id}/reject")
def reject_verification(
    request_id: int,
    admin_note: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    )
):
    verification = (
        db.query(VerificationRequest)
        .filter(
            VerificationRequest.id == request_id,
            VerificationRequest.status == "PENDING"
        )
        .first()
    )

    if verification is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification request not found"
        )

    verification.status = "REJECTED"
    verification.admin_note = admin_note
    verification.reviewed_at = datetime.utcnow()

    db.commit()

    return {
        "message": "Verification rejected"
    }