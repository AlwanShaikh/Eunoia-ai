import logging
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session

from app.schemas.memory import MemoryCreate, MemoryUpdate, MemoryResponse
from app.models.memory import Memory
from app.models.user import User
from app.core.database import get_db
from app.core.security import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(tags=["memory"])


@router.get("/memories", response_model=list[MemoryResponse])
def get_memories(
    category: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> list[MemoryResponse]:
    """Get all memories for the current user."""
    user = current_user
    
    query = db.query(Memory).filter(Memory.user_id == user.id)
    
    if category:
        query = query.filter(Memory.category == category)
    
    memories = query.order_by(Memory.updated_at.desc()).all()
    
    return [
        MemoryResponse(
            id=memory.id,
            user_id=memory.user_id,
            key=memory.key,
            value=memory.value,
            category=memory.category,
            created_at=memory.created_at,
            updated_at=memory.updated_at
        )
        for memory in memories
    ]


@router.post("/memories", response_model=MemoryResponse)
def create_memory(
    memory_data: MemoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> MemoryResponse:
    """Create a new memory for the current user."""
    user = current_user
    
    # Check if memory with same key already exists
    existing_memory = db.query(Memory).filter(
        Memory.user_id == user.id,
        Memory.key == memory_data.key
    ).first()
    
    if existing_memory:
        # Update existing memory
        existing_memory.value = memory_data.value
        existing_memory.category = memory_data.category
        existing_memory.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing_memory)
        
        return MemoryResponse(
            id=existing_memory.id,
            user_id=existing_memory.user_id,
            key=existing_memory.key,
            value=existing_memory.value,
            category=existing_memory.category,
            created_at=existing_memory.created_at,
            updated_at=existing_memory.updated_at
        )
    
    # Create new memory
    new_memory = Memory(
        user_id=user.id,
        key=memory_data.key,
        value=memory_data.value,
        category=memory_data.category
    )
    
    db.add(new_memory)
    db.commit()
    db.refresh(new_memory)
    
    logger.info(f"Memory created for user {user.username}: {memory_data.key}")
    
    return MemoryResponse(
        id=new_memory.id,
        user_id=new_memory.user_id,
        key=new_memory.key,
        value=new_memory.value,
        category=new_memory.category,
        created_at=new_memory.created_at,
        updated_at=new_memory.updated_at
    )


@router.put("/memories/{memory_id}", response_model=MemoryResponse)
def update_memory(
    memory_id: int,
    memory_data: MemoryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> MemoryResponse:
    """Update an existing memory."""
    user = current_user
    
    memory = db.query(Memory).filter(
        Memory.id == memory_id,
        Memory.user_id == user.id
    ).first()
    
    if not memory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Memory not found"
        )
    
    # Update fields
    if memory_data.value is not None:
        memory.value = memory_data.value
    if memory_data.category is not None:
        memory.category = memory_data.category
    
    memory.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(memory)
    
    return MemoryResponse(
        id=memory.id,
        user_id=memory.user_id,
        key=memory.key,
        value=memory.value,
        category=memory.category,
        created_at=memory.created_at,
        updated_at=memory.updated_at
    )


@router.delete("/memories/{memory_id}")
def delete_memory(
    memory_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> dict:
    """Delete a memory."""
    user = current_user
    
    memory = db.query(Memory).filter(
        Memory.id == memory_id,
        Memory.user_id == user.id
    ).first()
    
    if not memory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Memory not found"
        )
    
    db.delete(memory)
    db.commit()
    
    logger.info(f"Memory deleted for user {user.username}: {memory.key}")
    
    return {"message": "Memory deleted successfully"}