from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    Float
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class VerificationRequest(Base):
    __tablename__ = "verification_requests"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    organization_name = Column(
        String(150),
        nullable=False
    )

    registration_number = Column(
        String(100),
        nullable=False
    )

    address = Column(String)

    city = Column(String)

    state = Column(String)

    latitude = Column(Float)

    longitude = Column(Float)

    description = Column(String)

    document_path = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        default="PENDING",
        nullable=False
    )

    admin_note = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    reviewed_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    user = relationship(
        "User",
        back_populates="verification_request"
    )