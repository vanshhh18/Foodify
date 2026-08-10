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
        document: str
    ):

        verification = VerificationRequest(
            user_id=user_id,
            organization_name=organization_name,
            registration_number=registration_number,
            document_path=document,
            status="PENDING"
        )

        db.add(verification)
        db.commit()
        db.refresh(verification)

        return verification