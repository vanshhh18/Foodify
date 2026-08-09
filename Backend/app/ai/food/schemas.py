from typing import Optional

from pydantic import BaseModel, Field


class FoodAISuggestion(BaseModel):

    title: Optional[str] = Field(
        default=None,
        description="Name or title of the food"
    )

    description: Optional[str] = Field(
        default=None,
        description="Description of the food visible in the image"
    )

    quantity: Optional[str] = Field(
        default=None,
        description="Estimated quantity if it can be reasonably determined from the image"
    )

    diet_type: Optional[str] = Field(
        default=None,
        description="vegetarian, non_vegetarian, vegan, or unknown"
    )

    condition: Optional[str] = Field(
        default=None,
        description="Visible condition of the food"
    )

    confidence: float = Field(
        description="Overall confidence between 0 and 1"
    )