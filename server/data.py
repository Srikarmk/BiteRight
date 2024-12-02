from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel,EmailStr
import os
from fastapi.responses import JSONResponse
from utils.Location_finder import find_nearby_restaurants 
from fastapi import Request
import pickle
from utils.Analytics_plot import retrieve_and_save_images 

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
        # Log the incoming customer data
        print("Received customer data:", customer.model_dump())
        
        if not all([
            customer.firstname,
            customer.lastname,
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

        # Check for existing customer by email
        existing_customer = customers_collection.find_one({"email": customer.email},{"_id":0})
        if existing_customer:
            raise HTTPException(status_code=400, detail="Email already registered")
            
        customer_dict = customer.model_dump()  # Use dict() instead of model_dump()
        
        # Insert the customer into the database
        result = customers_collection.insert_one(customer_dict)
        
        # If insertion failed
        if not result.acknowledged:
            raise HTTPException(status_code=500, detail="Failed to insert customer data")
        customer_dict['_id'] = str(result.inserted_id)
        
        return JSONResponse(content={"success": True, "user": customer_dict})
    
    except Exception as e:
        # Log error details
        print("Error details:", str(e)) 
        raise HTTPException(status_code=500, detail="Internal server error")


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
                "review_count":1,
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
        
        

class AddressRequest(BaseModel):
    address: str
    radius_km: int = 5  
    

@app.post("/recognize-items/")
async def find_nearby_by_address(request: AddressRequest):
    try:
        address = request.address
        radius_km = request.radius_km
        
        # Log the input values for debugging
        print(f"Received address: {address}, radius: {radius_km} km")

        nearby_restaurants = find_nearby_restaurants(address, radius_km)

        # Log the output of the function
        print(f"Nearby restaurants found: {nearby_restaurants}")

        result_data = {
            "searched_address": address,
            "radius_km": radius_km,
            "nearby_restaurants": nearby_restaurants,
        }
        return {"message": "Results stored successfully", "results": result_data}

    except Exception as e:
        print("Error in find_nearby_by_address:", str(e))  
        raise HTTPException(status_code=500, detail=str(e))
    
    
@app.delete("/customers/{email}")
async def delete_customer(email: str):
    try:
        result = customers_collection.delete_one({"email": email})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        return {"message": "Customer deleted successfully"} 
    except Exception as e:
        print("Error in delete_customer:", str(e))
        raise HTTPException(status_code=500, detail="An error occurred while deleting the customer")
    
class Order(BaseModel):
    restaurant_id: int
    restaurant_name: str
    items_ordered: list
    item_count: int
    amount: int
    status: str

order_id_counter = 16000

@app.post("/orders")
async def create_order(order:Order):
    global order_id_counter
    print("Received order data:", order.model_dump())
    order.amount=float(order.amount)
    try:
        new_order = {
            "order_id": order_id_counter,
            "restaurant_id": order.restaurant_id,
            "restaurant_name": order.restaurant_name,
            "items_ordered": order.items_ordered,
            "item_count": order.item_count,
            "amount": order.amount,
            "status": order.status
        }
        print(new_order)
        result = db["Orders"].insert_one(new_order)
        if not result.acknowledged:
            raise HTTPException(status_code=500, detail="Failed to insert order data")
        order_id_counter += 1
        
        return {"message": "Order created successfully", "order_id": new_order["order_id"]}
    except Exception as e:
        print("Error in create_order:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/orders")
async def get_orders():
    try:
        # Fetch the latest order from the Orders collection
        latest_order = db["Orders"].find_one({}, sort=[("order_id", -1)])  # Retrieve the latest order
        
        if latest_order:
            latest_order["_id"] = str(latest_order["_id"])  # Convert ObjectId to string
            return {"order": latest_order}  # Return the latest order
        else:
            return {"order": None}  # No orders found
    except Exception as e:
        print("Error in get_orders:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
    



     
import base64
import pickle
from fastapi import HTTPException

@app.get("/analytics/{restaurant_id}")
async def get_analytics(restaurant_id: int):
    try:
        if restaurant_id is None:
            raise HTTPException(status_code=400, detail="restaurant_id is required")

        analytics_data = db["Analytics"].find_one(
            {"restaurant_id": restaurant_id},
            {"_id": 0, "Top_items": 1, "status_dist": 1}
        )

        if not analytics_data:
            raise HTTPException(
                status_code=404,
                detail=f"No analytics data found for restaurant_id: {restaurant_id}"
            )

        for field in ["Top_items", "status_dist"]:
            if isinstance(analytics_data.get(field), (bytes, bytearray)):
                try:
                    analytics_data[field] = base64.b64encode(analytics_data[field]).decode("utf-8")
                except Exception as e:
                    raise HTTPException(status_code=500, detail=f"Error processing {field}: {str(e)}")

        return {"success": True, "analytics": analytics_data}

    except Exception as e:
        print("Error in get_analytics:", str(e))
        raise HTTPException(
            status_code=500, 
            detail="An error occurred while fetching analytics data"
        )
        
        
def get_orders_collection():
    return db["Orders"]  



@app.get("/analytics/{restaurant_id}/highest_ordered_dish")
async def get_highest_ordered_dish(restaurant_id: int):
    pipeline = [
        {"$match": {"restaurant_id": restaurant_id}},  
        {"$project": {
            "dish_quantities": {
                "$objectToArray": "$Items_ordered" 
            }
        }},
        {"$unwind": "$dish_quantities"},   
        {"$group": {
            "_id": "$dish_quantities.k",  
            "total_quantity": {"$sum": "$dish_quantities.v"}  
        }},
        {"$sort": {"total_quantity": -1}},  
        {"$limit": 1},  
        {"$project": {
            "_id": 0,
            "highest_ordered_dish": "$_id",
            "highest_quantity": "$total_quantity"  
        }}
    ]
    result = list(get_orders_collection().aggregate(pipeline))
    return result[0] if result else {"message": "No data found"}


# 2. Endpoint for total revenue
@app.get("/analytics/{restaurant_id}/total_revenue")
async def get_total_revenue(restaurant_id: int):
    pipeline = [
        {"$match": {"restaurant_id": restaurant_id}},
        {"$group": {
            "_id": "$restaurant_id",
            "total_sales": {"$sum": "$Amount"}
        }},
        {"$project": {
            "_id": 0,
            "restaurant_id": "$_id",
            "total_sales": 1
        }}
    ]
    result = list(get_orders_collection().aggregate(pipeline))
    return result[0] if result else {"message": "No data found"}


# 3. Endpoint for the most recent order's status
@app.get("/analytics/{restaurant_id}/recent_order_status")
async def get_recent_order_status(restaurant_id: int):
    pipeline = [
        {"$match": {"restaurant_id": restaurant_id}},
        {"$sort": {"order_id": -1}},  
        {"$limit": 1},
        {"$project": {
            "_id": 0,
            "order_id": 1,
            "Status": 1
        }}
    ]
    result = list(get_orders_collection().aggregate(pipeline))
    return result[0] if result else {"message": "No data found"}



class AnalyticsRequest(BaseModel):
    restaurant_id: int
    
@app.get("/orders/{restaurant_id}")
async def get_recent_orders(restaurant_id: int):
    try:
        recent_orders = list(db["Orders"].find({"restaurant_id": restaurant_id},{"_id":0}).sort("order_id", -1).limit(5))
        
        return {"success": True, "recent_orders": recent_orders}
    except Exception as e:
        print("Error in get_recent_orders:", str(e))  # Log the error
        raise HTTPException(status_code=500, detail="An error occurred while fetching recent orders")
    
class OrderUpdate(BaseModel):
    status: str 

# @app.put("/orders/{order_id}")
# async def update_order_status(order_id: int, order_update: OrderUpdate):  # Use the Pydantic model
#     try:
#         # Update the order status in the database
#         result = db["Orders"].update_one(
#             {"order_id": order_id},  # Find the order by order_id
#             {"$set": {"status": order_update.status}}  # Update the status
#         )
        
#         if result.modified_count == 0:
#             raise HTTPException(status_code=404, detail="Order not found or status unchanged")
        
#         return {"message": "Order status updated successfully"}
#     except Exception as e:
#         print("Error in update_order_status:", str(e))
#         raise HTTPException(status_code=500, detail="An error occurred while updating the order status")



@app.get("/save-images/{restaurant_id}")
async def save_images(restaurant_id: int):
    try:
        image1, image2 = retrieve_and_save_images(restaurant_id)
        
        # Convert images to base64
        import io
        import base64

        # Create a BytesIO object to hold the image data
        img1_bytes = io.BytesIO()
        img2_bytes = io.BytesIO()

        # Save the images to the BytesIO object
        image1.savefig(img1_bytes, format="png")
        image2.savefig(img2_bytes, format="png")

        # Get the byte data from the BytesIO object
        img1_bytes.seek(0)
        img2_bytes.seek(0)

        # Encode the byte data to base64
        img1_base64 = base64.b64encode(img1_bytes.read()).decode("utf-8")
        img2_base64 = base64.b64encode(img2_bytes.read()).decode("utf-8")

        return {
            "message": "Images retrieved successfully",
            "images": {
                "image1": img1_base64,
                "image2": img2_base64
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))