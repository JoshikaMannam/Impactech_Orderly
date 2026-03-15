import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

GROQ_KEY = os.getenv("GROQ_API_KEY", "")

INTENT_PROMPT = """
You are the AI brain of a restaurant voice ordering system called Orderly.

The user has spoken the following command:
"{transcript}"

The restaurant serves: Breakfast, Chaat, Starters, Veg Curry, Non-Veg Curry,
Breads, Rice, Combos, Pizza, Burgers, Sides, Desserts, Beverages.

Analyze the intent and extract key information.

Respond ONLY with a valid JSON object in this exact format:
{{
  "intent": "ADD_ITEM" | "REMOVE_ITEM" | "REPLACE_ITEM" | "CANCEL_ORDER" | "TRACK_ORDER" | "VIEW_ORDER" | "CHECK_ITEM",
  "item_name": "extracted item name or null",
  "replace_with": "replacement item name or null (only for REPLACE_ITEM)",
  "quantity": 1
}}

Rules:
- intent must be exactly one of the 7 options above
- item_name must be cleaned and normalized (e.g. "chicken biryani" not "a chicken biryani")
- quantity defaults to 1 if not mentioned
- Return ONLY the JSON object, no explanation, no markdown, no code fences
"""

RECOMMENDATION_PROMPT = """
A customer at an Indian restaurant has ordered: {ordered_items}

From this available menu: {menu_list}

Suggest exactly 3 complementary items they might also enjoy.
Consider food pairing: biryani pairs with raita, curry pairs with naan, etc.

Respond ONLY with a JSON array of exactly 3 item name strings.
Example: ["Garlic Naan", "Mango Lassi", "Raita"]
No explanation, no markdown, just the JSON array.
"""

def _clean_json(raw: str) -> str:
    raw = raw.strip()
    if "" in raw:
        parts = raw.split("")
        raw   = parts[1] if len(parts) > 1 else parts[0]
        if raw.startswith("json"):
            raw = raw[4:]
    return raw.strip()

async def _call_groq(prompt: str, temperature: float = 0) -> str:
    headers = {
        "Authorization": f"Bearer {GROQ_KEY}",
        "Content-Type":  "application/json"
    }
    body = {
        "model": "llama3-8b-8192",
        "messages": [
            {
                "role":    "system",
                "content": "You are a restaurant AI assistant. Always respond with valid JSON only. No markdown, no explanation."
            },
            {
                "role":    "user",
                "content": prompt
            }
        ],
        "temperature": temperature,
        "max_tokens":  200
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=body
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

async def detect_intent(transcript: str) -> dict:
    try:
        raw    = await _call_groq(
            INTENT_PROMPT.format(transcript=transcript),
            temperature=0
        )
        result = json.loads(_clean_json(raw))
        return {
            "intent":       result.get("intent", "UNKNOWN"),
            "item_name":    result.get("item_name", None),
            "replace_with": result.get("replace_with", None),
            "quantity":     int(result.get("quantity", 1)),
        }
    except json.JSONDecodeError:
        return {
            "intent":       "UNKNOWN",
            "item_name":    None,
            "replace_with": None,
            "quantity":     1
        }
    except httpx.HTTPStatusError as e:
        raise Exception(f"Groq API error: {e.response.status_code}")
    except Exception as e:
        raise Exception(f"Intent detection failed: {str(e)}")

async def get_recommendations_ai(ordered_items: list, menu_list: str) -> list:
    try:
        raw    = await _call_groq(
            RECOMMENDATION_PROMPT.format(
                ordered_items=", ".join(ordered_items),
                menu_list=menu_list
            ),
            temperature=0.7
        )
        result = json.loads(_clean_json(raw))
        return result if isinstance(result, list) else []
    except Exception:
        return []