from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    JSON,
    Float,
    String
)
from sqlalchemy.orm import relationship

from app.database import Base


class AIAnalysis(Base):

    __tablename__ = "ai_analysis"

    id = Column(
        Integer,
        primary_key=True
    )

    donation_id = Column(
        Integer,
        ForeignKey("donations.id"),
        nullable=False
    )

    diet_type = Column(
        String,
        nullable=True
    )

    condition = Column(
        String,
        nullable=True
    )

    analysis_json = Column(
        JSON,
        nullable=True
    )

    confidence_score = Column(
        Float,
        nullable=True
    )

    donation = relationship(
        "Donation",
        back_populates="ai_analysis"
    )