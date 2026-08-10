from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Float,
    DateTime
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    claimed_by_user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    category = Column(String)

    title = Column(String)

    description = Column(String)

    quantity = Column(String)

    pickup_address = Column(String)

    latitude = Column(Float)

    longitude = Column(Float)

    status = Column(String, default="PENDING")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    user = relationship(
        "User",
        back_populates="donations",
        foreign_keys=[user_id]
    )

    claimed_by = relationship(
        "User",
        foreign_keys=[claimed_by_user_id]
    )

    images = relationship(
        "DonationImage",
        back_populates="donation",
        cascade="all, delete-orphan"
    )

    ai_analysis = relationship(
        "AIAnalysis",
        back_populates="donation",
        uselist=False,
        cascade="all, delete-orphan"
    )