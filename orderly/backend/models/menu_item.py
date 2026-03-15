from pydantic import BaseModel
from typing import List

# menu_items table: id, name, category, price, is_available, is_special

class MenuItemOut(BaseModel):
    id: int
    name: str
    category: str
    price: float
    is_available: bool
    is_special: bool

class UpdateSpecials(BaseModel):
    items: List[int]
    