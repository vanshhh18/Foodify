from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class DonationImage(Base):
    __tablename__ = "donation_images"

    id = Column(Integer, primary_key=True)

    donation_id = Column(
        Integer,
        ForeignKey("donations.id")
    )

    image_url = Column(String)

    donation = relationship(
        "Donation",
        back_populates="images"
    )