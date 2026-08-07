from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class NGO(Base):
    __tablename__ = "ngos"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    ngo_name = Column(String, nullable=False)

    registration_number = Column(String)

    address = Column(String)

    city = Column(String)

    state = Column(String)

    latitude = Column(Float)

    longitude = Column(Float)

    description = Column(String)

    verified = Column(Boolean, default=False)

    user = relationship(
        "User",
        back_populates="ngo"
    )