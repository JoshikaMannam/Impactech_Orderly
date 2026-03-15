from services.ai_service import detect_intent

async def process_transcript(transcript: str, order_id: int, db) -> dict:
    """
    Full voice pipeline:
    transcript → Groq AI → MySQL (your exact columns) → response
    
    order_items columns: id, order_id, menu_item_id, item_name, quantity, price
    orders columns:      id, user_id, status, total_price, created_at, updated_at
    """
    parsed = await detect_intent(transcript)

    intent    = parsed.get("intent", "UNKNOWN")
    item_name = parsed.get("item_name")
    qty       = int(parsed.get("quantity", 1))

    cursor = db.cursor(dictionary=True)

    # ── ADD_ITEM ──────────────────────────────────────────────
    if intent == "ADD_ITEM" and item_name:
        cursor.execute(
            """SELECT id, name, category, price, is_available
               FROM menu_items
               WHERE LOWER(name) LIKE LOWER(%s)
               LIMIT 1""",
            (f"%{item_name}%",)
        )
        item = cursor.fetchone()

        if not item:
            cursor.close()
            return {
                "intent":  intent,
                "item":    None,
                "message": f"Sorry, {item_name} is not on our menu."
            }

        if not item["is_available"]:
            cursor.close()
            return {
                "intent":  intent,
                "item":    item,
                "message": f"{item['name']} is currently unavailable."
            }

        # Check if item already exists in this order
        cursor.execute(
            """SELECT id, quantity FROM order_items
               WHERE order_id = %s AND menu_item_id = %s""",
            (order_id, item["id"])
        )
        existing = cursor.fetchone()

        if existing:
            # Update quantity
            cursor.execute(
                "UPDATE order_items SET quantity = quantity + %s WHERE id = %s",
                (qty, existing["id"])
            )
        else:
            # Insert new order item — uses item_name and quantity
            cursor.execute(
                """INSERT INTO order_items
                   (order_id, menu_item_id, item_name, quantity, price)
                   VALUES (%s, %s, %s, %s, %s)""",
                (order_id, item["id"], item["name"], qty, item["price"])
            )

        # Update order total
        cursor.execute(
            "UPDATE orders SET total_price = total_price + %s WHERE id = %s",
            (item["price"] * qty, order_id)
        )

        # Audit log
        cursor.execute(
            """INSERT INTO order_history (order_id, action, details)
               VALUES (%s, %s, %s)""",
            (order_id, "ADD_ITEM",
             f"Added {qty}x {item['name']} @ ₹{item['price']}")
        )
        db.commit()
        cursor.close()
        return {
            "intent":  intent,
            "item":    {**item, "quantity": qty},
            "message": f"Added {qty} {item['name']} to your order. That's ₹{item['price'] * qty:.0f}."
        }

    # ── REMOVE_ITEM ───────────────────────────────────────────
    elif intent == "REMOVE_ITEM" and item_name:
        cursor.execute(
            """SELECT oi.id, oi.quantity, oi.price, oi.item_name, oi.menu_item_id
               FROM order_items oi
               JOIN menu_items mi ON oi.menu_item_id = mi.id
               WHERE oi.order_id = %s AND LOWER(mi.name) LIKE LOWER(%s)
               LIMIT 1""",
            (order_id, f"%{item_name}%")
        )
        oi = cursor.fetchone()

        if not oi:
            cursor.close()
            return {
                "intent":  intent,
                "item":    None,
                "message": f"{item_name} is not in your current order."
            }

        cursor.execute(
            "DELETE FROM order_items WHERE id = %s",
            (oi["id"],)
        )
        cursor.execute(
            "UPDATE orders SET total_price = total_price - %s WHERE id = %s",
            (oi["price"] * oi["quantity"], order_id)
        )
        cursor.execute(
            """INSERT INTO order_history (order_id, action, details)
               VALUES (%s, %s, %s)""",
            (order_id, "REMOVE_ITEM", f"Removed {oi['item_name']}")
        )
        db.commit()
        cursor.close()
        return {
            "intent":  intent,
            "item":    {"id": oi["menu_item_id"]},
            "message": f"Removed {oi['item_name']} from your order."
        }

    # ── REPLACE_ITEM ──────────────────────────────────────────
    elif intent == "REPLACE_ITEM" and item_name and parsed.get("replace_with"):
        replace_with = parsed["replace_with"]

        # Find old item in order
        cursor.execute(
            """SELECT oi.id, oi.quantity, oi.price, oi.item_name
               FROM order_items oi
               JOIN menu_items mi ON oi.menu_item_id = mi.id
               WHERE oi.order_id = %s AND LOWER(mi.name) LIKE LOWER(%s)
               LIMIT 1""",
            (order_id, f"%{item_name}%")
        )
        old = cursor.fetchone()

        # Find new item in menu
        cursor.execute(
            """SELECT id, name, price, is_available
               FROM menu_items
               WHERE LOWER(name) LIKE LOWER(%s)
               LIMIT 1""",
            (f"%{replace_with}%",)
        )
        new_item = cursor.fetchone()

        if not old:
            cursor.close()
            return {"intent": intent, "item": None,
                    "message": f"{item_name} is not in your order."}
        if not new_item:
            cursor.close()
            return {"intent": intent, "item": None,
                    "message": f"{replace_with} is not on our menu."}
        if not new_item["is_available"]:
            cursor.close()
            return {"intent": intent, "item": None,
                    "message": f"{new_item['name']} is currently unavailable."}

        # Delete old item, insert new item
        cursor.execute(
            "DELETE FROM order_items WHERE id = %s", (old["id"],)
        )
        cursor.execute(
            """INSERT INTO order_items
               (order_id, menu_item_id, item_name, quantity, price)
               VALUES (%s, %s, %s, %s, %s)""",
            (order_id, new_item["id"], new_item["name"],
             old["quantity"], new_item["price"])
        )

        # Adjust total price difference
        diff = (new_item["price"] - old["price"]) * old["quantity"]
        cursor.execute(
            "UPDATE orders SET total_price = total_price + %s WHERE id = %s",
            (diff, order_id)
        )
        cursor.execute(
            """INSERT INTO order_history (order_id, action, details)
               VALUES (%s, %s, %s)""",
            (order_id, "REPLACE_ITEM",
             f"Replaced {old['item_name']} with {new_item['name']}")
        )
        db.commit()
        cursor.close()
        return {
            "intent":  intent,
            "item":    {**new_item, "quantity": old["quantity"]},
            "message": f"Replaced {old['item_name']} with {new_item['name']}."
        }

    # ── CANCEL_ORDER ──────────────────────────────────────────
    elif intent == "CANCEL_ORDER":
        # Your orders table uses 'active' not 'received'
        cursor.execute(
            """UPDATE orders SET status = 'cancelled'
               WHERE id = %s AND status = 'active'""",
            (order_id,)
        )
        if cursor.rowcount == 0:
            cursor.close()
            return {
                "intent":  intent,
                "item":    None,
                "message": "Your order cannot be cancelled at this stage."
            }
        cursor.execute(
            """INSERT INTO order_history (order_id, action, details)
               VALUES (%s, %s, %s)""",
            (order_id, "CANCEL_ORDER", "Order cancelled by customer via voice")
        )
        db.commit()
        cursor.close()
        return {
            "intent":  intent,
            "item":    None,
            "message": "Your order has been cancelled."
        }

    # ── TRACK_ORDER ───────────────────────────────────────────
    elif intent == "TRACK_ORDER":
        cursor.execute(
            "SELECT status FROM orders WHERE id = %s", (order_id,)
        )
        order = cursor.fetchone()
        cursor.close()
        if not order:
            return {"intent": intent, "item": None,
                    "message": "Order not found."}
        # Your status values: active / completed / cancelled
        status_msg = {
            "active":    "Your order has been received and is being prepared.",
            "completed": "Your order is ready! Please collect it.",
            "cancelled": "Your order has been cancelled.",
        }
        return {
            "intent":  intent,
            "item":    None,
            "message": status_msg.get(
                order["status"],
                f"Your order status is {order['status']}."
            )
        }

    # ── VIEW_ORDER ────────────────────────────────────────────
    elif intent == "VIEW_ORDER":
        # Uses item_name and quantity columns
        cursor.execute(
            """SELECT item_name, quantity, price
               FROM order_items
               WHERE order_id = %s""",
            (order_id,)
        )
        items = cursor.fetchall()
        cursor.close()
        if not items:
            return {"intent": intent, "item": None,
                    "message": "Your cart is empty."}
        summary = ", ".join(
            [f"{i['quantity']} {i['item_name']}" for i in items]
        )
        total = sum(i["price"] * i["quantity"] for i in items)
        return {
            "intent":  intent,
            "item":    None,
            "message": f"Your order has: {summary}. Total is ₹{total:.0f}."
        }

    # ── CHECK_ITEM ────────────────────────────────────────────
    elif intent == "CHECK_ITEM" and item_name:
        cursor.execute(
            """SELECT id, name, category, price, is_available
               FROM menu_items
               WHERE LOWER(name) LIKE LOWER(%s)
               LIMIT 1""",
            (f"%{item_name}%",)
        )
        item = cursor.fetchone()
        cursor.close()
        if not item:
            return {"intent": intent, "item": None,
                    "message": f"Sorry, {item_name} is not on our menu."}
        if item["is_available"]:
            return {
                "intent":  intent,
                "item":    item,
                "message": f"Yes, {item['name']} is available for ₹{item['price']}."
            }
        return {
            "intent":  intent,
            "item":    item,
            "message": f"Sorry, {item['name']} is currently unavailable."
        }

    # ── UNKNOWN ───────────────────────────────────────────────
    cursor.close()
    return {
        "intent":  "UNKNOWN",
        "item":    None,
        "message": "Sorry, I didn't understand that. Please try again."
    }

