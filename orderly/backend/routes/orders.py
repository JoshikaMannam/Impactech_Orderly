from fastapi import APIRouter, Depends, HTTPException
from database.db import get_db
from models.order import OrderCreate, OrderItemIn, OrderItemRemove, OrderStatusUpdate
from services.order_service import get_order_with_items, get_orders_by_status

router = APIRouter()

@router.post("/create")
def create_order(body: OrderCreate, db=Depends(get_db)):
    cursor = db.cursor()
    # Your orders status default is 'active'
    cursor.execute(
        """INSERT INTO orders (user_id, status, total_price)
           VALUES (%s, 'active', 0.00)""",
        (body.user_id,)
    )
    db.commit()
    order_id = cursor.lastrowid
    cursor.close()
    return {"order_id": order_id, "message": "Order created"}

@router.post("/add-item")
def add_item(body: OrderItemIn, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM menu_items WHERE id = %s", (body.menu_item_id,)
    )
    item = cursor.fetchone()
    if not item:
        cursor.close()
        raise HTTPException(status_code=404, detail="Menu item not found")
    if not item["is_available"]:
        cursor.close()
        raise HTTPException(status_code=400, detail="Item currently unavailable")

    # Check if already in order
    cursor.execute(
        """SELECT id, quantity FROM order_items
           WHERE order_id = %s AND menu_item_id = %s""",
        (body.order_id, body.menu_item_id)
    )
    existing = cursor.fetchone()

    if existing:
        cursor.execute(
            "UPDATE order_items SET quantity = quantity + %s WHERE id = %s",
            (body.quantity, existing["id"])
        )
    else:
        # Uses item_name and quantity columns
        cursor.execute(
            """INSERT INTO order_items
               (order_id, menu_item_id, item_name, quantity, price)
               VALUES (%s, %s, %s, %s, %s)""",
            (body.order_id, item["id"], item["name"],
             body.quantity, item["price"])
        )

    cursor.execute(
        "UPDATE orders SET total_price = total_price + %s WHERE id = %s",
        (item["price"] * body.quantity, body.order_id)
    )
    cursor.execute(
        """INSERT INTO order_history (order_id, action, details)
           VALUES (%s, %s, %s)""",
        (body.order_id, "ADD_ITEM",
         f"Added {body.quantity}x {item['name']}")
    )
    db.commit()
    cursor.close()
    return {"message": f"Added {item['name']} to order"}

@router.post("/remove-item")
def remove_item(body: OrderItemRemove, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        """SELECT * FROM order_items
           WHERE order_id = %s AND menu_item_id = %s""",
        (body.order_id, body.menu_item_id)
    )
    oi = cursor.fetchone()
    if not oi:
        cursor.close()
        raise HTTPException(status_code=404, detail="Item not found in order")

    cursor.execute("DELETE FROM order_items WHERE id = %s", (oi["id"],))
    cursor.execute(
        "UPDATE orders SET total_price = total_price - %s WHERE id = %s",
        (oi["price"] * oi["quantity"], body.order_id)
    )
    cursor.execute(
        """INSERT INTO order_history (order_id, action, details)
           VALUES (%s, %s, %s)""",
        (body.order_id, "REMOVE_ITEM", f"Removed {oi['item_name']}")
    )
    db.commit()
    cursor.close()
    return {"message": f"Removed {oi['item_name']} from order"}

@router.get("/track/{order_id}")
def track_order(order_id: int, db=Depends(get_db)):
    order = get_order_with_items(order_id, db)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
@router.put("/cancel/{order_id}")
def cancel_order(order_id: int, db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute(
        """UPDATE orders SET status = 'cancelled'
           WHERE id = %s AND status = 'active'""",
        (order_id,)
    )
    if cursor.rowcount == 0:
        cursor.close()
        raise HTTPException(
            status_code=400,
            detail="Order cannot be cancelled"
        )
    cursor.execute(
        """INSERT INTO order_history (order_id, action, details)
           VALUES (%s, %s, %s)""",
        (order_id, "CANCEL_ORDER", "Order cancelled")
    )
    db.commit()
    cursor.close()
    return {"message": "Order cancelled"}

@router.get("/history/{user_id}")
def order_history(user_id: int, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        """SELECT * FROM orders
           WHERE user_id = %s
           ORDER BY created_at DESC""",
        (user_id,)
    )
    orders = cursor.fetchall()
    for order in orders:
        cursor.execute(
            "SELECT * FROM order_items WHERE order_id = %s",
            (order["id"],)
        )
        order["items"] = cursor.fetchall()
    cursor.close()
    return orders

@router.get("/list")
def list_orders(status: str = "active", db=Depends(get_db)):
    # Valid status values: active / completed / cancelled
    return get_orders_by_status(status, db)

@router.put("/status/{order_id}")
def update_status(
    order_id: int,
    body: OrderStatusUpdate,
    db=Depends(get_db)
):
    # Only allow your actual enum values
    allowed = {"active", "completed", "cancelled"}
    if body.status not in allowed:
        raise HTTPException(
            status_code=400,
            detail="Invalid status. Use: active, completed, cancelled"
        )
    cursor = db.cursor()
    cursor.execute(
        "UPDATE orders SET status = %s WHERE id = %s",
        (body.status, order_id)
    )
    cursor.execute(
        """INSERT INTO order_history (order_id, action, details)
           VALUES (%s, %s, %s)""",
        (order_id, "STATUS_UPDATE",
         f"Status changed to {body.status}")
    )
    db.commit()
    cursor.close()
    return {"message": f"Order status updated to {body.status}"}