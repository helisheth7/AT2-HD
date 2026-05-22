from pydantic import BaseModel 
from typing import Optional 

# data expected for new user sign up 
class UserRegister(BaseModel):
    username: str
    email: str
    password: str

# data expected for user log in 
class UserLogin(BaseModel): 
    email: str
    password: str

# response sent back after successful login 
class TokenResponse(BaseModel): 
    access_token: str
    token_type: str

# data expected when creating or updating a product
class Product(BaseModel): 
    name: str 
    description: str
    price: float
    category: str
    image_url: str
    stock: int

# allows partial updates so that only field can be updated if needed
class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    stock: Optional[int] = None

# data expected when adding item to cart 
class CartItem(BaseModel): 
    product_id: str
    quantity: int

# allows updating only the quantity of a cart item 
class CartItemUpdate(BaseModel): 
    quantity: int
