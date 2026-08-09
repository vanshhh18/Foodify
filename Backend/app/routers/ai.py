
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
    status
)

from app.models.user import User
from app.models.enums import UserRole

from app.auth.dependencies import require_role

from app.services.ai_service import AIService


from app.schemas.ai import AISuggestionResponse

from app.services.image_service import ImageService

router = APIRouter(
    prefix="/donations",
    tags=["Donation AI"]
)


@router.post("/ai-suggest",
             response_model=AISuggestionResponse
             )
async def generate_ai_suggestions(
    category: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(
        require_role(UserRole.DONOR)
    )
):

    # Validate category
    allowed_categories = {
        "food",
        "clothes",
        "books"
    }

    category = category.lower()

    if category not in allowed_categories:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported donation category"
        )

    # Validate image
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

    # Read image
    image_data = await file.read()

    # Save image permanently
    image = ImageService.save_image(
       image_data=image_data,
       original_filename=file.filename
    )

    file_path = image["file_path"]
    image_url = image["image_url"]
    

        # Generate AI suggestions
    result = AIService.generate_suggestions(
            category=category,
            image_path=file_path
        )

    return {
            "category": category,
            "suggestions": result.model_dump(),
            "image_url": image_url
        }
