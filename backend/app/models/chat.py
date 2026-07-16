from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime, timezone

from app.core.database import Base


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        String(100),
        index=True,
        default="default_user"
    )

    session_id = Column(
        String(100),
        index=True,
        default="default_session"
    )

    role = Column(
        String(20)
    )

    content = Column(
        Text
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )