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
class TokenRequest(BaseModel): 
    access_token: str
    token_type: str