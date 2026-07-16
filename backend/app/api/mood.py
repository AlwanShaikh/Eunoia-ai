import logging
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.schemas.mood import MoodEntryCreate, MoodEntryResponse, MoodStats
from app.models.mood import MoodEntry
from app.models.user import User
from app.core.database import get_db
from app.core.security import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(tags=["mood"])


@router.post("/mood", response_model=MoodEntryResponse)
def create_mood_entry(
    mood_data: MoodEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> MoodEntryResponse:
    """Create a new mood entry for the current user."""
    user = current_user
    
    # Validate mood score (1-10)
    if mood_data.mood_score < 1 or mood_data.mood_score > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mood score must be between 1 and 10"
        )
    
    # Create new mood entry
    new_entry = MoodEntry(
        user_id=user.id,
        mood_score=mood_data.mood_score,
        mood_label=mood_data.mood_label,
        note=mood_data.note
    )
    
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    
    logger.info(f"Mood entry created for user {user.username}: {mood_data.mood_label} ({mood_data.mood_score})")
    
    return MoodEntryResponse(
        id=new_entry.id,
        user_id=new_entry.user_id,
        mood_score=new_entry.mood_score,
        mood_label=new_entry.mood_label,
        note=new_entry.note,
        created_at=new_entry.created_at
    )


@router.get("/mood/history", response_model=list[MoodEntryResponse])
def get_mood_history(
    limit: int = Query(30, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> list[MoodEntryResponse]:
    """Get mood history for the current user."""
    user = current_user
    
    entries = db.query(MoodEntry).filter(
        MoodEntry.user_id == user.id
    ).order_by(MoodEntry.created_at.desc()).limit(limit).all()
    
    return [
        MoodEntryResponse(
            id=entry.id,
            user_id=entry.user_id,
            mood_score=entry.mood_score,
            mood_label=entry.mood_label,
            note=entry.note,
            created_at=entry.created_at
        )
        for entry in entries
    ]


@router.get("/mood/stats", response_model=MoodStats)
def get_mood_stats(
    days: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> MoodStats:
    """Get mood statistics for the current user."""
    user = current_user
    
    # Calculate date range
    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=days)
    
    # Get entries in date range
    entries = db.query(MoodEntry).filter(
        MoodEntry.user_id == user.id,
        MoodEntry.created_at >= start_date,
        MoodEntry.created_at <= end_date
    ).all()
    
    if not entries:
        return MoodStats(
            average_score=0.0,
            total_entries=0,
            recent_entries=[]
        )
    
    # Calculate average
    total_score = sum(entry.mood_score for entry in entries)
    average_score = round(total_score / len(entries), 1)
    
    # Get recent entries (last 7)
    recent_entries = sorted(entries, key=lambda x: x.created_at, reverse=True)[:7]
    
    return MoodStats(
        average_score=average_score,
        total_entries=len(entries),
        recent_entries=[
            MoodEntryResponse(
                id=entry.id,
                user_id=entry.user_id,
                mood_score=entry.mood_score,
                mood_label=entry.mood_label,
                note=entry.note,
                created_at=entry.created_at
            )
            for entry in recent_entries
        ]
    )


@router.get("/mood/trends")
def get_mood_trends(
    days: int = Query(7, ge=1, le=30),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> dict:
    """Get mood trends for visualization."""
    user = current_user
    
    # Calculate date range
    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=days)
    
    # Get daily averages
    entries = db.query(
        func.date(MoodEntry.created_at).label('date'),
        func.avg(MoodEntry.mood_score).label('avg_score'),
        func.count(MoodEntry.id).label('count')
    ).filter(
        MoodEntry.user_id == user.id,
        MoodEntry.created_at >= start_date,
        MoodEntry.created_at <= end_date
    ).group_by(func.date(MoodEntry.created_at)).order_by('date').all()
    
    trends = [
        {
            "date": str(entry.date),
            "average_score": round(float(entry.avg_score), 1),
            "entries_count": entry.count
        }
        for entry in entries
    ]
    
    return {
        "trends": trends,
        "period_days": days
    }