def get_order_with_items(order_id: int, db) -> dict:
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM orders WHERE id = %s", (order_id,)
    )
    order = cursor.fetchone()
    if not order:
        cursor.close()
        return None
    # Uses item_name and quantity
    cursor.execute(
        "SELECT * FROM order_items WHERE order_id = %s", (order_id,)
    )
    order["items"] = cursor.fetchall()
    cursor.close()
    return order

def get_orders_by_status(status: str, db) -> list:
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        """SELECT * FROM orders
           WHERE status = %s
           ORDER BY created_at DESC""",
        (status,)
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

def recalculate_total(order_id: int, db):
    cursor = db.cursor()
    cursor.execute(
        """UPDATE orders
           SET total_price = (
               SELECT COALESCE(SUM(price * quantity), 0)
               FROM order_items
               WHERE order_id = %s
           )
           WHERE id = %s""",
        (order_id, order_id)
    )
    db.commit()
    cursor.close()

