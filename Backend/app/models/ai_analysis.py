from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    JSON,
    Float
)
from sqlalchemy.orm import relationship

from app.database import Base


class AIAnalysis(Base):
    __tablename__ = "ai_analysis"

    id = Column(Integer, primary_key=True)

    donation_id = Column(
        Integer,
        ForeignKey("donations.id")
    )

    analysis_json = Column(JSON)

    confidence_score = Column(Float)

    donation = relationship(
        "Donation",
        back_populates="ai_analysis"
    )