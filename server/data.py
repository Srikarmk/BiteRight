from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel
import os

app = FastAPI()

MONGO_DB_URL = "mongodb+srv://srikarmks:6Y2zyA11hkNIRW6I@restaurant.qf5lj.mongodb.net/?retryWrites=true&w=majority&appName=Restaurant" 


client = MongoClient(MONGO_DB_URL)
db = client.get_database("Biterite")
collection = db["Staff"]

class DataItem(BaseModel):
    name: str
    description: str

@app.get("/")
async def read_root():
    try:
        data = list(collection.find({}, {"_id": 0}))  
        return {"data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
