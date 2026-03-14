from fastapi import FastAPI
from typing import List
from models import get_menu_items, search_menu, create_order, add_item, track_order, save_customer_info, get_customer_info
from pydantic import BaseModel

app = FastAPI()

# -----------------------------
# SCHEMAS
# -----------------------------
class CustomerInfo(BaseModel):
    name: str
    allergies: List[str] = []
    preferences: List[str] = []

class OrderItem(BaseModel):
    item_name: str
    quantity: int

class BillItem(BaseModel):
    item_name: str
    quantity: int
    price: float

class Bill(BaseModel):
    customer: CustomerInfo
    items: List[BillItem]
    total: float

# -----------------------------
# TEST ROUTE
# -----------------------------
@app.get("/")
def home():
    return {"message": "Orderly Backend Running"}

# -----------------------------
# MENU ROUTES
# -----------------------------
@app.get("/menu")
def menu():
    menu = get_menu_items()
    return {"menu": menu}

@app.get("/menu/search")
def menu_search(name: str):
    results = search_menu(name)
    return {"results": results}

# -----------------------------
# ORDER ROUTES
# -----------------------------
@app.post("/order/create")
def order_create(user_id: int, customer: CustomerInfo):
    order_id = create_order(user_id)
    save_customer_info(customer)
    return {"message": "Order created", "order_id": order_id}

@app.post("/order/add-item")
def order_add_item(order_id: int, item: OrderItem):
    result = add_item(order_id, item.item_name, item.quantity)
    return result

@app.get("/order/track/{order_id}")
def order_track(order_id: int):
    order_data = track_order(order_id)
    customer = get_customer_info(order_id)
    order_data["customer"] = customer
    return order_data

# -----------------------------
# BILL ROUTE
# -----------------------------
@app.get("/order/bill/{order_id}")
def generate_bill(order_id: int):
    data = track_order(order_id)
    customer = get_customer_info(order_id)

    if not data["order"]:
        return {"error": "Order not found"}

    items = [
        BillItem(item_name=item["item_name"], quantity=item["quantity"], price=item["price"])
        for item in data["items"]
    ]
    total = sum(item.price for item in items)

    bill = Bill(customer=customer, items=items, total=total)
    return bill