from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from database.db import get_db
from services.recommendation_service import get_recommendations

router = APIRouter()

class RecommendationRequest(BaseModel):
    order_id: int
    items: List[dict]

@router.post("/recommendations")
async def recommendations(
    body: RecommendationRequest,
    db=Depends(get_db)
):
    recs = await get_recommendations(body.items, db)
    return {"recommendations": recs}

@router.get("/stats")
def get_stats(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT COUNT(*) AS total FROM orders WHERE status = 'active'"
    )
    active = cursor.fetchone()["total"]

    cursor.execute(
        "SELECT COUNT(*) AS total FROM orders WHERE status = 'completed'"
    )
    completed = cursor.fetchone()["total"]

    cursor.execute(
        "SELECT COUNT(*) AS total FROM orders WHERE status = 'cancelled'"
    )
    cancelled = cursor.fetchone()["total"]

    cursor.execute(
        """SELECT COALESCE(SUM(total_price), 0) AS revenue
           FROM orders WHERE status = 'completed'"""
    )
    revenue = float(cursor.fetchone()["revenue"])

    # Top 5 items using item_name and quantity columns
    cursor.execute(
        """SELECT oi.item_name, SUM(oi.quantity) AS total_qty
           FROM order_items oi
           GROUP BY oi.item_name
           ORDER BY total_qty DESC
           LIMIT 5"""
    )
    top_items = cursor.fetchall()

    cursor.close()
    return {
        "active":    active,
        "completed": completed,
        "cancelled": cancelled,
        "revenue":   revenue,
        "top_items": top_items,
    }