from fastapi import APIRouter, HTTPException
from models import UserRegister, UserLogin, TokenResponse
from database import db
from auth import hash_password, verify_password, create_token

router = APIRouter()

@router.post("/register")
async def register(user: UserRegister):
    # checks if email already exists in db 
    existing = await db.users.find_one({"email": user.email})
    if existing: 
        raise HTTPException(status_code=400, detail = "Email already registered")

    # builds user to insert into MongoDB 
    new_user = { 
        "username": user.username, 
        "email": user.email, 
        "password": hash_password(user.password), 
        "role": "user"
    }
    await db.users.insert_one(new_user)
    return {"message": "User registered successfully"}

# looks up user by email 
@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin): 
    db_user = await db.users.find_one({"email": user.email})

    # returns 401 error if user not found or password doesn't match
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail = "Invalid email or password")

    # creates a jwt token with user id and role embedded
    # frontend should store this token and send w future requests
    token = create_token({"sub": str(db_user["_id"]), "role": db_user["role"]})
    return {"access_token": token, "token_type": "bearer"}