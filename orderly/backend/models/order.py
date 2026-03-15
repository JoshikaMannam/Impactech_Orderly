from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# orders table: id, user_id, status(active/completed/cancelled),
#               total_price, created_at, updated_at
# order_items table: id, order_id, menu_item_id, item_name, quantity, price

class OrderCreate(BaseModel):
    user_id: Optional[int] = None

class OrderStatusUpdate(BaseModel):
    status: str  # active / completed / cancelled

class OrderItemIn(BaseModel):
    order_id: int
    menu_item_id: int
    quantity: Optional[int] = 1

class OrderItemRemove(BaseModel):
    order_id: int
    menu_item_id: int

class OrderItemOut(BaseModel):
    id: int
    menu_item_id: int
    item_name: str
    price: float
    quantity: int

class OrderOut(BaseModel):
    id: int
    user_id: Optional[int]
    status: str
    total_price: float
    created_at: datetime
    items: Optional[List[OrderItemOut]] = []