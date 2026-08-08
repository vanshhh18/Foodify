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

    class Config:
        from_attributes = True