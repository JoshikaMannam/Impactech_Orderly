from fastapi import APIRouter, Depends, HTTPException
from database.db import get_db
from models.menu_item import UpdateSpecials
from middleware.auth_middleware import require_staff

router = APIRouter()

@router.get("/")
def get_all(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM menu_items ORDER BY category, name"
    )
    items = cursor.fetchall()
    cursor.close()
    return items

@router.get("/search")
def search(name: str, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM menu_items WHERE LOWER(name) LIKE LOWER(%s)",
        (f"%{name}%",)
    )
    items = cursor.fetchall()
    cursor.close()
    return items

@router.get("/category")
def by_category(name: str, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        """SELECT * FROM menu_items
           WHERE category = %s
           ORDER BY name""",
        (name,)
    )
    items = cursor.fetchall()
    cursor.close()
    return items

@router.get("/specials")
def get_specials(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        """SELECT * FROM menu_items
           WHERE is_special = 1 AND is_available = 1"""
    )
    items = cursor.fetchall()
    cursor.close()
    return items

@router.put("/specials")
def update_specials(
    body: UpdateSpecials,
    db=Depends(get_db),
    _=Depends(require_staff)
):
    cursor = db.cursor()
    cursor.execute("UPDATE menu_items SET is_special = 0")
    if body.items:
        placeholders = ", ".join(["%s"] * len(body.items))
        cursor.execute(
            f"UPDATE menu_items SET is_special = 1 WHERE id IN ({placeholders})",
            tuple(body.items)
        )
    db.commit()
    cursor.close()
    return {"message": "Specials updated successfully"}

@router.put("/{item_id}/availability")
def toggle_availability(
    item_id: int,
    db=Depends(get_db),
    _=Depends(require_staff)
):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, name FROM menu_items WHERE id = %s", (item_id,)
    )
    item = cursor.fetchone()
    if not item:
        cursor.close()
        raise HTTPException(status_code=404, detail="Item not found")
    cursor.execute(
        "UPDATE menu_items SET is_available = NOT is_available WHERE id = %s",
        (item_id,)
    )
    db.commit()
    cursor.close()
    return {"message": f"Availability toggled for {item['name']}"}