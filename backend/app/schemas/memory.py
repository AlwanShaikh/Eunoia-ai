from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MemoryBase(BaseModel):
    key: str
    value: str
    category: str = "preference"


class MemoryCreate(MemoryBase):
    pass


class MemoryUpdate(BaseModel):
    value: Optional[str] = None
    category: Optional[str] = None


class MemoryResponse(MemoryBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True