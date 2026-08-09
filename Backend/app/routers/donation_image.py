import os
import uuid

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    status
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user import User
from app.models.donation import Donation
from app.models.donation_image import DonationImage
from app.models.enums import UserRole

from app.auth.dependencies import require_role

from app.services.ai_service import AIService

from app.models.ai_analysis import AIAnalysis

router = APIRouter(
    prefix="/donations",
    tags=["Donation Images"]
)


@router.post("/{donation_id}/images")
async def upload_donation_image(
    donation_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.DONOR)
    )
):

    # 1. Find the donation
    donation = db.query(Donation).filter(
        Donation.id == donation_id,
        Donation.user_id == current_user.id
    ).first()

    if donation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )

    # 2. Validate image type
    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp"
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, PNG and WEBP images are allowed"
        )

    # 3. Read image
    image_data = await file.read()

    # 4. Create uploads directory
    upload_dir = "uploads"

    os.makedirs(
        upload_dir,
        exist_ok=True
    )

    # 5. Generate unique filename
    extension = os.path.splitext(
        file.filename
    )[1]

    filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(
        upload_dir,
        filename
    )

    # 6. Save image
    with open(file_path, "wb") as buffer:
        buffer.write(image_data)

    # 7. Save image information in database
    image = DonationImage(
        donation_id=donation.id,
        image_url=file_path
    )

    db.add(image)
    db.commit()
    db.refresh(image)

    # 8. Run AI
    ai_result = None

    if donation.category.lower() == "food":

        ai_result = AIService.analyze_food(
             file_path
    )

    # Convert Pydantic result to dictionary
        ai_data = ai_result.model_dump()

    # Save AI analysis
        analysis = AIAnalysis(
            donation_id=donation.id,
            analysis_json=ai_data,
            confidence_score=ai_result.confidence
    )

        db.add(analysis)
        db.commit()
        db.refresh(analysis)


    return {
    "message": "Image uploaded successfully",
    "image_id": image.id,
    "image_url": image.image_url,
    "ai_analysis": ai_result
}