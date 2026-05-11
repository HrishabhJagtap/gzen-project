"""AI micro-task generation via Emergent LLM key + Gemini 3 Flash.

Falls back to a curated static task if the LLM call fails (so the demo never breaks).
"""
import json
import re
import uuid
import logging
from typing import Optional

from emergentintegrations.llm.chat import LlmChat, UserMessage

from config import EMERGENT_LLM_KEY

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You are Gzen, a calm AI wellbeing coach. When a user is about to open a "
    "distracting app, you must generate ONE 60-second productive micro-task "
    "that interrupts the doomscroll and rewires the habit. "
    "The task must be: short, doable in under 60 seconds, encouraging (not punishing), "
    "and personally relevant. "
    "Return ONLY a JSON object with this exact shape — no prose, no markdown:\n"
    '{"type": "summarize" | "reflect" | "mindfulness" | "priority", '
    '"prompt": "<the question or task in one sentence>", '
    '"context": "<1-2 sentence supporting context the user reads before answering>", '
    '"suggested_answer": "<a short example answer that hints at what success looks like>"}'
)

# Curated fallback tasks — used when LLM is unavailable.
FALLBACK_TASKS = [
    {
        "type": "summarize",
        "prompt": "Summarize this news in one line.",
        "context": "AI chips may power the next wave of smartphones, with on-device intelligence becoming a key differentiator.",
        "suggested_answer": "AI chips will power the next generation of smartphones.",
    },
    {
        "type": "reflect",
        "prompt": "Write one thing you're grateful for today.",
        "context": "Reflect on a small win, a person, or a feeling that made today better.",
        "suggested_answer": "I'm grateful for my morning coffee and a clear sky.",
    },
    {
        "type": "priority",
        "prompt": "What is your top priority for the next hour?",
        "context": "Be specific. Pick one task you can actually finish in 60 minutes.",
        "suggested_answer": "Finish the Gzen demo prep slides.",
    },
    {
        "type": "mindfulness",
        "prompt": "Take 3 slow breaths. Type the feeling that follows.",
        "context": "Close your eyes if you can. Inhale 4 seconds, hold 4, exhale 6.",
        "suggested_answer": "Calmer and more present.",
    },
]


def _pick_fallback(style: Optional[str]) -> dict:
    if style:
        for t in FALLBACK_TASKS:
            if t["type"] == style:
                return t
    return FALLBACK_TASKS[0]


def _extract_json(text: str) -> Optional[dict]:
    """Extract first JSON object found in text, robust to code fences."""
    if not text:
        return None
    # strip code fences if present
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    # find the first {...} block
    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if not match:
        return None
    try:
        return json.loads(match.group(0))
    except Exception:
        return None


async def generate_micro_task(
    intent: str = "habit",
    goal: str = "improve focus",
    time_of_day: Optional[int] = None,
    style: Optional[str] = None,
) -> dict:
    """Generate a micro-task. Returns {type, prompt, context, suggested_answer}."""
    user_text = (
        f"Generate a micro-task for a user about to open a distracting app.\n"
        f"Intent: {intent}\n"
        f"User goal: {goal}\n"
        f"Time of day (24h): {time_of_day if time_of_day is not None else 'unknown'}\n"
        f"Preferred style: {style or 'choose the most helpful'}\n"
        f"Return only the JSON object."
    )
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"gzen-task-{uuid.uuid4()}",
            system_message=SYSTEM_PROMPT,
        ).with_model("gemini", "gemini-3-flash-preview")
        response = await chat.send_message(UserMessage(text=user_text))
        parsed = _extract_json(response if isinstance(response, str) else str(response))
        if (
            parsed
            and isinstance(parsed, dict)
            and all(k in parsed for k in ("type", "prompt", "context", "suggested_answer"))
        ):
            # ensure type is one of the allowed values
            if parsed["type"] not in {"summarize", "reflect", "mindfulness", "priority"}:
                parsed["type"] = "reflect"
            return {
                "type": parsed["type"],
                "prompt": str(parsed["prompt"])[:240],
                "context": str(parsed["context"])[:400],
                "suggested_answer": str(parsed["suggested_answer"])[:240],
            }
        logger.warning("AI returned unparseable response, using fallback. Raw: %s", response)
    except Exception as e:
        logger.warning("AI generate_micro_task failed: %s — using fallback", e)
    return _pick_fallback(style)
