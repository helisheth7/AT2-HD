from pydantic import BaseModel
from typing import Optional

class CartItem(BaseModel):
    product_id: str
    product_name: str
    price: float
    quantity: int

class ShoppingCart(BaseModel):
    user_email: str
    items: list[CartItem] = []