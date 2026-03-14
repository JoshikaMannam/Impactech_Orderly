import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def process_voice(transcript, menu_list, allergies=None, preferences=None):
    """
    allergies/preferences are optional lists to prevent recommending items
    that the customer can't have.
    """

    allergies = allergies or []
    preferences = preferences or []

    prompt = f"""
You are an order assistant for Rasoi Royal restaurant.

Given a voice transcript, extract the intent and item details and return ONLY a JSON object.

Menu items available:
{menu_list}

Customer allergies: {allergies}
Customer preferences: {preferences}

Return format:
{{
"intent": "",
"item_name": "",
"quantity": null,
"replace_item": null,
"order_id": null,
"response_text": ""
}}

Transcript:
{transcript}
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "You extract structured order data."},
            {"role": "user", "content": prompt}
        ],
        temperature=0
    )

    result = response.choices[0].message.content
    return result