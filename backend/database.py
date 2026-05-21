from motor.motor_asyncio import AsnycIOMotorClient 
from dotenv import load_dotenv
import os 

load_dotenv()

# creates mongodb client using connection string from env file and selects db by name 
client = AsyncIOMotorClient(os.getenv("mongodb+srv://helisheth7:<db_password>@cluster0.bb7ui04.mongodb.net/?appName=Cluster0"))
db = client[os.getenv("at2")]