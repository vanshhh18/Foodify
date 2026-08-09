from sqlalchemy.orm import Session

from app.models.donation import Donation
from app.schemas.donation import DonationCreate, DonationUpdate

from app.models.donation_image import DonationImage

from app.models.ai_analysis import AIAnalysis

class DonationService:

    @staticmethod
    def create_donation(
        db: Session,
        donation: DonationCreate,
        user_id: int
    ):

        new_donation = Donation(
            user_id=user_id,
            category=donation.category,
            title=donation.title,
            description=donation.description,
            quantity=donation.quantity,
            pickup_address=donation.pickup_address,
            latitude=donation.latitude,
            longitude=donation.longitude
        )

        db.add(new_donation)
        db.commit()
        db.refresh(new_donation)

    # Save image reference if an image was uploaded
        if donation.image_url:

            donation_image = DonationImage(
                donation_id=new_donation.id,
                image_url=donation.image_url
            )

            db.add(donation_image)
            db.commit()

        if donation.ai_analysis:

            ai_data = donation.ai_analysis

            analysis = AIAnalysis(
                donation_id=new_donation.id,
                analysis_json=ai_data,
                confidence_score=ai_data.get("confidence")
            )

            db.add(analysis)
            db.commit()

        return new_donation
    @staticmethod
    def get_user_donations(
        db: Session,
        user_id: int
    ):
        return (
        db.query(Donation)
        .filter(Donation.user_id == user_id)
        .order_by(Donation.created_at.desc())
        .all()
    )

    @staticmethod
    def get_donation_by_id(
        db: Session,
        donation_id: int,
        user_id: id
    ):
        return (
            db.query(Donation)
            .filter(
                Donation.id == donation_id,
                Donation.user_id == user_id
            )
            .first()
            )


    @staticmethod
    def update_donation(
        db: Session,
        donation_id: int,
        user_id: int,
        donation_data: DonationUpdate
    ):
        donation = (
            db.query(Donation)
            .filter(
                Donation.id == donation_id,
                Donation.user_id == user_id
            )
            .first()
        )

        if donation is None:
            return None

        update_data = donation_data.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(donation, field, value)

        db.commit()
        db.refresh(donation)

        return donation


    @staticmethod
    def delete_donation(
        db: Session,
        donation_id: int,
        user_id: int
    ):

        donation = (
            db.query(Donation)
            .filter(
                Donation.id == donation_id,
                Donation.user_id == user_id
            )
            .first()
        )

        if donation is None:
            return None

        db.delete(donation)
        db.commit()

        return donation