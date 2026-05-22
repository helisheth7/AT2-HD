from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
import os

load_dotenv()

# pw hashing algorithm
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# pulls secret key and algorithm from env file 
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

# plain text pw gets returned as hash vers for safe storage 
def hash_password(password: str) -> str: 
    return pwd_context.hash(password)

# checks if plain text password matches the stored hashed version
def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# creates jwt token w user data that expires after 24 hours
def create_token(data: dict) -> str: 
    payload = data.copy() 
    payload["exp"] = datetime.utcnow() + timedelta(hours=24)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# decodes and verifies jwt token + raises error if token is invalid or expired 
def decode_token(token:str) -> dict: 
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])