import os
import uuid

from sqlalchemy.orm import Session

from app.models.verification import VerificationRequest


class VerificationService:

    @staticmethod
    def create_request(
        db: Session,
        user_id: int,
        organization_name: str,
        registration_number: str,
        address: str,
        city: str,
        state: str,
        latitude: float | None,
        longitude: float | None,
        description: str | None,
        document: str
    ):

        verification = VerificationRequest(
            user_id=user_id,
            organization_name=organization_name,
            registration_number=registration_number,
            address=address,
            city=city,
            state=state,
            latitude=latitude,
            longitude=longitude,
            description=description,
            document_path=document,
            status="PENDING"
        )

        db.add(verification)
        db.commit()
        db.refresh(verification)

        return verification