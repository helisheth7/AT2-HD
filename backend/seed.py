import os 
os.chdir(os.path.dirname(os.path.abspath(__file__)))

import asyncio
from database import db
from auth import hash_password

# Creates default admin account in database 
# run python seed.py for use

# checks if admin exists so duplicates aren't created
async def seed_admin(): 
    existing = await db.users.find_one({"email": "admin@shop.com"})
    if existing:
        print("Admin account already exists")
        return
    
    admin = {
        "username": "admin",
        "email": "admin@shop.com",
        "password": hash_password("admin123"),
        "role": "admin"
    }
    await db.users.insert_one(admin)
    print("Admin account created: admin@shop.com / admin123")

asyncio.run(seed_admin())
