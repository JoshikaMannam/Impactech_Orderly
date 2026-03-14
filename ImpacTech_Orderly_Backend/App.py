from fastapi import FastAPI
import mysql.connector

app = FastAPI()

# DATABASE CONNECTION
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="YOUR_PASSWORD",
    database="orderly"
)

cursor = db.cursor(dictionary=True)


# TEST ROUTE
@app.get("/")
def home():
    return {"message": "Orderly Backend Running"}


# GET FULL MENU
@app.get("/menu")
def get_menu():
    cursor.execute("SELECT * FROM menu_items WHERE is_available = 1")
    menu = cursor.fetchall()
    return {"menu": menu}


# SEARCH MENU ITEM
@app.get("/menu/search")
def search_menu(name: str):
    query = "SELECT * FROM menu_items WHERE LOWER(name) LIKE LOWER(%s)"
    cursor.execute(query, ("%" + name + "%",))
    results = cursor.fetchall()
    return {"results": results}


# CREATE ORDER
@app.post("/order/create")
def create_order(user_id: int):
    query = "INSERT INTO orders (user_id,status,total_price) VALUES (%s,'active',0)"
    cursor.execute(query, (user_id,))
    db.commit()

    order_id = cursor.lastrowid

    return {
        "message": "Order created",
        "order_id": order_id
    }


# ADD ITEM TO ORDER
@app.post("/order/add-item")
def add_item(order_id: int, item_name: str, quantity: int):

    # find item
    query = "SELECT id,name,price,is_available FROM menu_items WHERE LOWER(name)=LOWER(%s)"
    cursor.execute(query, (item_name,))
    item = cursor.fetchone()

    if not item:
        return {"error": "Item not found on menu"}

    if item["is_available"] == 0:
        return {"error": "Item currently unavailable"}

    item_total = item["price"] * quantity

    # insert into order_items
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

    # update total price
    update_query = """
    UPDATE orders
    SET total_price = total_price + %s
    WHERE id = %s
    """

    cursor.execute(update_query, (item_total, order_id))
    db.commit()

    return {
        "message": f"{quantity} {item['name']} added",
        "added_price": item_total
    }


# TRACK ORDER
@app.get("/order/track/{order_id}")
def track_order(order_id: int):

    query = "SELECT * FROM orders WHERE id = %s"
    cursor.execute(query, (order_id,))
    order = cursor.fetchone()

    if not order:
        return {"error": "Order not found"}

    item_query = "SELECT * FROM order_items WHERE order_id = %s"
    cursor.execute(item_query, (order_id,))
    items = cursor.fetchall()

    return {
        "order": order,
        "items": items
    }