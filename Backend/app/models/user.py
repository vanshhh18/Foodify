from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(100), nullable=False)

    email = Column(String(100), unique=True, nullable=False)

    password_hash = Column(String, nullable=False)

    phone_number = Column(String(20))

    role = Column(String(20), nullable=False)

    profile_image = Column(String)

    is_verified = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    donations = relationship(
        "Donation",
        back_populates="user"
    )

    ngo = relationship(
        "NGO",
        back_populates="user",
        uselist=False
    )