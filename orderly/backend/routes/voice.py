from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from database.db import get_db
from services.voice_service import process_transcript

router = APIRouter()

class VoiceRequest(BaseModel):
    transcript: str
    order_id: Optional[int] = None

@router.post("/process")
async def process_voice(body: VoiceRequest, db=Depends(get_db)):
    if not body.transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript is empty")

    order_id = body.order_id

    # Auto-create order if none provided
    if not order_id:
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO orders (status, total_price) VALUES ('active', 0.00)"
        )
        db.commit()
        order_id = cursor.lastrowid
        cursor.close()

    result = await process_transcript(body.transcript, order_id, db)
    result["order_id"] = order_id
    return result