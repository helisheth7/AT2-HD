import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# force correct .env path
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH, override=True)

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")

print("ENV PATH:", ENV_PATH)
print("MONGO_URL loaded:", MONGO_URL is not None)
print("DB_NAME loaded:", DB_NAME)

if not MONGO_URL:
    raise Exception("MONGO_URL missing in .env")

if not DB_NAME:
    raise Exception("DB_NAME missing in .env")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]