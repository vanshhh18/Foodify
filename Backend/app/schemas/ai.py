from typing import Optional

from pydantic import BaseModel


class AISuggestions(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[str] = None
    diet_type: Optional[str] = None
    condition: Optional[str] = None
    confidence: float


class AISuggestionResponse(BaseModel):
    category: str
    suggestions: AISuggestions
    image_url: str