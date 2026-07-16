from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MoodEntryBase(BaseModel):
    mood_score: int
    mood_label: str
    note: Optional[str] = None


class MoodEntryCreate(MoodEntryBase):
    pass


class MoodEntryResponse(MoodEntryBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MoodStats(BaseModel):
    average_score: float
    total_entries: int
    recent_entries: list[MoodEntryResponse]