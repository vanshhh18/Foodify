from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class DonationCreate(BaseModel):
    category: str
    title: str
    description: Optional[str] = None
    quantity: Optional[str] = None
    pickup_address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_url: str | None = None
    ai_analysis: dict | None = None
    

class DonationUpdate(BaseModel):
    category: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[str] = None
    pickup_address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class DonationImageResponse(BaseModel):
    id: int
    image_url: str

    class Config:
        from_attributes = True


class AIAnalysisResponse(BaseModel):
    
    confidence_score: float | None = None
    analysis_json: dict | None = None
    class Config:
        from_attributes = True


class DonationResponse(BaseModel):
    id: int
    user_id: int
    category: str
    title: str
    description: Optional[str]
    quantity: Optional[str]
    pickup_address: str
    latitude: Optional[float]
    longitude: Optional[float]
    status: str
    created_at: datetime
    images: list[DonationImageResponse] = []
    ai_analysis: AIAnalysisResponse | None = None

    class Config:
        from_attributes = True