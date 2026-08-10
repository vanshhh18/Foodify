from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class VerificationResponse(BaseModel):
    id: int
    user_id: int
    organization_name: Optional[str] = None
    registration_number: Optional[str] = None
    document_path: str
    status: str
    admin_note: Optional[str] = None
    created_at: datetime
    reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True