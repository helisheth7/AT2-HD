from motor.motor_asyncio import AsyncIOMotorClient 
from dotenv import load_dotenv
import os 

load_dotenv()

# creates mongodb client using connection string from env file and selects db by name 
client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
db = client[os.getenv("DB_NAME")]