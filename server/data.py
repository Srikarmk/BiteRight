from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel,EmailStr
import os
from fastapi.responses import JSONResponse

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"], 
)

MONGO_DB_URL = "mongodb+srv://srikarmks:6Y2zyA11hkNIRW6I@restaurant.qf5lj.mongodb.net/?retryWrites=true&w=majority&appName=Restaurant" 


client = MongoClient(MONGO_DB_URL)
db = client.get_database("Biterite")
collection = db["Staff"]
customers_collection = db["Customers"]
staff_collection=db["Staff"]

class DataItem(BaseModel):
    name: str
    description: str

class Customer(BaseModel):
    firstName: str 
    lastName: str   
    email: str
    contactNum: str 
    address: str
    zip: str
    password: str  
    
class StaffLoginCredentials(BaseModel):
    restaurantId: str
    email: str
    password: str
    role: str
    
@app.get("/")
async def read_root():
    try:
        data = list(collection.find({}, {"_id": 0}))  
        return {"data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login")
async def login(credentials: dict):
    try:
        customer = customers_collection.find_one({
            "email": credentials["email"],
            "password": credentials["password"]
        }, {"_id": 0})
        
        if customer:
            return JSONResponse(content={"success": True, "user": customer})
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    
# @app.post("/customers")
# async def create_customer(customer: Customer):
#     try:
#         print("Received customer data:", customer.model_dump())
#         existing_customer = customers_collection.find_one({"email": customer.email})
#         if existing_customer:
#             raise HTTPException(status_code=400, detail="Email already registered")
            
#         customer_dict = customer.model_dump()
#         result = customers_collection.insert_one(customer_dict)
#         return {"message": "Customer created successfully", "customer": customer_dict}
#     except Exception as e:
#         print("Error details:", str(e)) 
#         raise HTTPException(status_code=500, detail=str(e))

@app.post("/customers")
async def create_customer(customer: Customer):
    try:
        # Validate required fields
        if not all([
            customer.firstName,
            customer.lastName,
            customer.email,
            customer.contactNum,
            customer.address,
            customer.zip,
            customer.password
        ]):
            raise HTTPException(
                status_code=400,
                detail="All fields are required"
            )
            
        if not customer.contactNum.isdigit():
            raise HTTPException(
                status_code=400,
                detail="Contact number should contain only digits"
            )
            
        if not customer.zip.isdigit():
            raise HTTPException(
                status_code=400,
                detail="ZIP code should contain only digits"
            )

        existing_customer = customers_collection.find_one({"email": customer.email})
        if existing_customer:
            raise HTTPException(status_code=400, detail="Email already registered")
            
        customer_dict = customer.model_dump()
        result = customers_collection.insert_one(customer_dict)
        
        if not result.acknowledged:
            raise HTTPException(status_code=500, detail="Failed to insert customer data")
            
        return {"message": "Customer created successfully", "customer": customer_dict}
    except Exception as e:
        print("Error details:", str(e)) 
        raise HTTPException(status_code=500, detail=str(e))
    


@app.post("/staff-login")
async def staff_login(credentials: dict):
    try:
        staff = staff_collection.find_one({
            "rest_id": credentials["restaurantId"],
            "rest_email": credentials["email"],
            "password": credentials["password"],
            "role": credentials["role"]
        }, {"_id": 0})
        
        if staff:
            return JSONResponse(content={"success": True, "user": staff})
        else:
            raise HTTPException(
                status_code=401, 
                detail="Invalid credentials. Please check your Restaurant ID, email, password, and role."
            )
    except Exception as e:
        print("Error in staff_login:", str(e)) 
        raise HTTPException(
            status_code=500, 
            detail="An internal server error occurred. Please try again later."
        )
        
@app.get("/staff/current/{staff_id}")
async def get_staff_details(staff_id: str):
    try:
        staff = staff_collection.find_one(
            {"staff_id": staff_id},
            {"_id": 0, "firstName": 1, "lastName": 1}
        )
        
        if staff:
            return JSONResponse(content={"success": True, "staff": staff})
        else:
            raise HTTPException(
                status_code=404,
                detail="Staff member not found"
            )
    except Exception as e:
        print("Error in get_staff_details")
        


@app.get("/restaurants/search/{query}")
async def search_restaurants(query: str):
    try:
        search_pattern = {"$regex": f".*{query}.*", "$options": "i"}
        
        restaurants = list(db["Restaurants"].aggregate([
            {
                "$match": {
                    "$or": [
                        {"name": search_pattern},
                    ]
                }
            },
            {
                "$group": {
                    "_id": "$restaurant_id",
                    "restaurant_id": {"$first": "$restaurant_id"},
                    "cuisine": {"$first": "$cuisine"},
                    "name": {"$first": "$name"},
                    "stars": {"$first": "$stars"},
                    "borough": {"$first": "$borough"}
                }
            },
            {"$limit": 20},
            {"$project": {
                "_id": 0,
                "restaurant_id": 1,
                "cuisine": 1,
                "name": 1,
                "stars": 1,
                "borough": 1
            }}
        ]))
        
        return JSONResponse(content={"success": True, "restaurants": restaurants})
    except Exception as e:
        print("Error in search_restaurants:", str(e))
        raise HTTPException(
            status_code=500,
            detail="An error occurred while searching restaurants"
        )
        

@app.get("/restaurants/{restaurant_id}")
async def get_restaurant_details(restaurant_id: int):
    try:
        restaurant = db["Restaurants"].find_one(
            {"restaurant_id": restaurant_id},
            {
                "_id": 0,
                "restaurant_id": 1,
                "name": 1,
                "cuisine": 1,
                "borough": 1,
                "address": 1,
                "stars": 1,
                "reviews": 1
            }
        )
        
        if not restaurant:
            raise HTTPException(
                status_code=404,
                detail="Restaurant not found"
            )
            
        return JSONResponse(content={"success": True, "restaurant": restaurant})
    except Exception as e:
        print("Error in get_restaurant_details:", str(e))
        raise HTTPException(
            status_code=500,
            detail="An error occurred while fetching restaurant details"
        )

@app.get("/restaurants/{restaurant_id}/menu")
async def get_restaurant_menu(restaurant_id: int):
    try:
        menu_items = list(db["Menu"].find(
            {"restaurant_id": restaurant_id},
            {
                "_id": 0,
                "restaurant_id":1,
                "menu_item": 1,
                "restaurant_name": 1,
                "price": 1,
            }
        ))
        
        if not menu_items:
            return JSONResponse(content={"success": True, "menu": []})
            
        return JSONResponse(content={"success": True, "menu": menu_items})
    except Exception as e:
        print("Error in get_restaurant_menu:", str(e))
        raise HTTPException(
            status_code=500,
            detail="An error occurred while fetching menu items"
        )