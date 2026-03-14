from db import get_db_connection

# -----------------------------
# MENU FUNCTIONS
# -----------------------------
def get_menu_items():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM menu_items WHERE is_available = 1")
    menu = cursor.fetchall()
    conn.close()
    return menu

def search_menu(name):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM menu_items WHERE LOWER(name) LIKE LOWER(%s)"
    cursor.execute(query, ("%" + name + "%",))
    results = cursor.fetchall()
    conn.close()
    return results

# -----------------------------
# ORDER FUNCTIONS
# -----------------------------
def create_order(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = "INSERT INTO orders (user_id,status,total_price) VALUES (%s,'active',0)"
    cursor.execute(query, (user_id,))
    conn.commit()
    order_id = cursor.lastrowid
    conn.close()
    return order_id

def add_item(order_id, item_name, quantity):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT id,name,price,is_available FROM menu_items WHERE LOWER(name)=LOWER(%s)"
    cursor.execute(query, (item_name,))
    item = cursor.fetchone()

    if not item:
        conn.close()
        return {"error": "Item not found"}

    if item["is_available"] == 0:
        conn.close()
        return {"error": "Item unavailable"}

    item_total = item["price"] * quantity

    insert_query = """
    INSERT INTO order_items (order_id,menu_item_id,item_name,quantity,price)
    VALUES (%s,%s,%s,%s,%s)
    """
    cursor.execute(insert_query, (
        order_id,
        item["id"],
        item["name"],
        quantity,
        item_total
    ))

    update_query = "UPDATE orders SET total_price = total_price + %s WHERE id = %s"
    cursor.execute(update_query, (item_total, order_id))
    conn.commit()
    conn.close()

    return {"message": f"{quantity} {item['name']} added", "added_price": item_total}

def track_order(order_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM orders WHERE id = %s", (order_id,))
    order = cursor.fetchone()

    cursor.execute("SELECT * FROM order_items WHERE order_id = %s", (order_id,))
    items = cursor.fetchall()

    conn.close()
    return {"order": order, "items": items}

# -----------------------------
# CUSTOMER INFO FUNCTIONS
# -----------------------------
# Simple table: customer_info(order_id, name, allergies, preferences)
def save_customer_info(customer):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Convert lists to comma-separated strings
    allergies = ",".join(customer.allergies)
    preferences = ",".join(customer.preferences)

    # Insert customer info for the latest order (assuming sequential creation)
    cursor.execute("""
        INSERT INTO customer_info (name,allergies,preferences)
        VALUES (%s,%s,%s)
    """, (customer.name, allergies, preferences))

    conn.commit()
    conn.close()

def get_customer_info(order_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    # fetch latest customer info (simplified)
    cursor.execute("SELECT * FROM customer_info ORDER BY id DESC LIMIT 1")
    customer = cursor.fetchone()
    conn.close()
    if customer:
        # Convert CSV back to list
        customer["allergies"] = customer["allergies"].split(",") if customer["allergies"] else []
        customer["preferences"] = customer["preferences"].split(",") if customer["preferences"] else []
    return customer