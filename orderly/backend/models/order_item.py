from pydantic import BaseModel

class OrderItemOut(BaseModel):
    id: int
    order_id: int
    menu_item_id: int
    item_name: str
    price: float
    quantity: int