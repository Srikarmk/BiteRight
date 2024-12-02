# %%
# !pip install pymongo -q
# !pip install datasets -q
# !pip install geopy -q

# %%
from datasets import load_dataset
from pymongo import MongoClient
from geopy.geocoders import GoogleV3
import requests
# from data import address, radius_km

# %%
connection_string = "mongodb+srv://srikarmks:6Y2zyA11hkNIRW6I@restaurant.qf5lj.mongodb.net/?retryWrites=true&w=majority&appName=Restaurant"
client = MongoClient(connection_string)
db = client["Biterite"]
collection = db["Restaurants"]

# %% [markdown]
# Because the location in the db is in not geospatial format. To use the address wwe need to convert into geospatial index ad pass it to Geocoding google API.

# %%
for document in collection.find({"location": {"$exists": True}}):
    location = document["location"]
    if not (isinstance(location, dict) and location.get("type") == "Point" and isinstance(location.get("coordinates"), list)
            and len(location["coordinates"]) == 2 and all(isinstance(coord, (float, int)) for coord in location["coordinates"])):
        print(f"Reformatting location for document _id: {document['_id']}")
        collection.update_one(
            {"_id": document["_id"]},
            {"$set": {"location": {"type": "Point", "coordinates": [-73.985130, 40.758896]}}}  # Placeholder coordinates
        )

# %% [markdown]
# Creates 2D sphere

# %%
collection.create_index([("location", "2dsphere")])

# %% [markdown]
# This is gets our location

# %% [markdown]
# I thought it'd be cool to get auto complete for that meh implementation of Places API by google.

# %%
# def get_address_autocomplete(input_text):
#     api_key = "Your_Google_API_Key"
#     url = f"https://maps.googleapis.com/maps/api/place/autocomplete/json?input={input_text}&key=AIzaSyDdkD964s2Gbsad-fc0EcnDU_i0dHI-oA4"
#     response = requests.get(url)
#     if response.status_code == 200:
#         predictions = response.json().get("predictions", [])
#         suggestions = [pred["description"] for pred in predictions]
#         return suggestions
#     else:
#         print("Error with autocomplete API:", response.status_code)
#         return []

# %%
def get_coordinates_google(address):
    geolocator = GoogleV3(api_key='AIzaSyDdkD964s2Gbsad-fc0EcnDU_i0dHI-oA4')
    location = geolocator.geocode(address)
    return (location.latitude, location.longitude)

# %%
def find_nearby_restaurants(address, radius_km, max_results=250):
    coordinates = get_coordinates_google(address)
    radius_meters = radius_km * 1600

    # Query MongoDB for restaurants within the radius
    results = list(collection.find({
        "location": {
            "$nearSphere": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [coordinates[1], coordinates[0]]  
                },
                "$maxDistance": radius_meters
            }
        }
    }).limit(max_results))

    # less than 50 restaurants in that radius still get 50 nearest(first the closest)
    if len(results) < max_results:
        print("Fewer than 50 restaurants found within the specified radius. Expanding search.")
        results = list(collection.find({
            "location": {
                "$nearSphere": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [coordinates[1], coordinates[0]]
                    }
                }
            }
        }).limit(max_results))

    if results:
        restaurant_details = []  # Initialize a list to collect restaurant details
        for restaurant in results:
            details = {
                "Name": restaurant.get('name'),
                "Address": restaurant.get('address'),
                "Coordinates": restaurant['location']['coordinates'],
                "Rating": restaurant.get('stars'),
                "Borough": restaurant.get('borough'),
                "Cuisine":restaurant.get('cuisine'),
                "PriceRange":restaurant.get("PriceRange"),
                "restId":restaurant.get("restaurant_id")
            }
            restaurant_details.append(details)  # Add details to the list
        return restaurant_details  # Return the collected details
    else:
        print("Uh-oh, sorry! No restaurants found.")



# %%
# input_text = input("Enter the address")
# suggestions = get_address_autocomplete(input_text)
# print("Autocomplete Suggestions:", suggestions)


# address = input("Enter the address:")
# radius_km = int(input("Enter the radius: "))
# find_nearby_restaurants(address, radius_km)


