import logging

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.gemini_service import GeminiService
from app.core.database import get_db
from app.models.chat import ChatMessage

logger = logging.getLogger(__name__)

router = APIRouter(tags=["chat"])

gemini_service: GeminiService | None = None


def get_gemini_service() -> GeminiService:
    global gemini_service

    if gemini_service is None:
        gemini_service = GeminiService()

    return gemini_service


@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(
    request: ChatRequest,
    db: Session = Depends(get_db)
) -> ChatResponse:

    message = request.message.strip()

    if not message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty"
        )

    try:
        user_id = "haze"
        session_id = "main_chat"

        # Load previous memory
        history_messages = (
            db.query(ChatMessage)
            .filter(
                ChatMessage.user_id == user_id,
                ChatMessage.session_id == session_id
            )
            .order_by(ChatMessage.created_at)
            .all()
        )

        conversation = []

        for item in history_messages[-10:]:
            conversation.append(
                {
                    "role": item.role,
                    "content": item.content
                }
            )

        # Save user message
        user_message = ChatMessage(
            user_id=user_id,
            session_id=session_id,
            role="user",
            content=message
        )

        db.add(user_message)
        db.commit()

        # Generate response
        service = get_gemini_service()

        response_text = service.generate_response(
            message,
            conversation
        )

        # Save AI response
        ai_message = ChatMessage(
            user_id=user_id,
            session_id=session_id,
            role="assistant",
            content=response_text
        )

        db.add(ai_message)
        db.commit()

        return ChatResponse(
            response=response_text
        )

    except Exception as exc:
        db.rollback()
        logger.exception("Chat error: %s", exc)

        raise HTTPException(
            status_code=500,
            detail=str(exc)
        )