from db import get_db_connection


# GET FULL MENU
def get_menu_items():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM menu_items WHERE is_available = 1")
    menu = cursor.fetchall()

    conn.close()
    return menu


# SEARCH MENU
def search_menu(name):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM menu_items WHERE LOWER(name) LIKE LOWER(%s)"
    cursor.execute(query, ("%" + name + "%",))

    results = cursor.fetchall()

    conn.close()
    return results


# CREATE ORDER
def create_order(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "INSERT INTO orders (user_id,status,total_price) VALUES (%s,'active',0)"
    cursor.execute(query, (user_id,))
    conn.commit()

    order_id = cursor.lastrowid

    conn.close()
    return order_id


# ADD ITEM TO ORDER
def add_item(order_id, item_name, quantity):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # find menu item
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

    update_query = """
    UPDATE orders
    SET total_price = total_price + %s
    WHERE id = %s
    """

    cursor.execute(update_query, (item_total, order_id))

    conn.commit()
    conn.close()

    return {"message": f"{quantity} {item['name']} added"}


# TRACK ORDER
def track_order(order_id):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM orders WHERE id = %s", (order_id,))
    order = cursor.fetchone()

    cursor.execute("SELECT * FROM order_items WHERE order_id = %s", (order_id,))
    items = cursor.fetchall()

    conn.close()

    return {
        "order": order,
        "items": items
    }