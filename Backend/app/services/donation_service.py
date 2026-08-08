from sqlalchemy.orm import Session

from app.models.donation import Donation
from app.schemas.donation import DonationCreate


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