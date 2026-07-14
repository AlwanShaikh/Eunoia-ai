import logging
import os

from groq import Groq

logger = logging.getLogger(__name__)


class GeminiService:
    """Handles communication with Groq API."""

    def __init__(self) -> None:
        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise ValueError("GROQ_API_KEY is not configured")

        self.client = Groq(api_key=api_key)
        self.model = "llama-3.3-70b-versatile"

        logger.info(
            "Groq service initialized with model %s",
            self.model
        )

    def generate_response(self, prompt: str, history=None) -> str:
        if not prompt or not prompt.strip():
            raise ValueError("Message cannot be empty")

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": """
You are Eunoia, an empathetic AI companion.

Your purpose is to listen, understand emotions, and support users through conversations.

Rules:
- Speak naturally and warmly.
- Acknowledge feelings before giving advice.
- Ask thoughtful questions.
- Avoid robotic replies.
- Encourage healthy thinking.
- Be calm, patient, and supportive.
- Remember details from previous conversation when available.
"""
                    },
                    *(history or []),
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=500,
            )

            return response.choices[0].message.content

        except Exception as exc:
            logger.exception("Groq API error: %s", exc)
            raise