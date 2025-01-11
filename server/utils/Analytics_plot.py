import pandas as pd
import numpy as np
import pickle
import ast
import pymongo
from pymongo import MongoClient

client = MongoClient('mongodb+srv://srikarmks:6Y2zyA11hkNIRW6I@restaurant.qf5lj.mongodb.net')
db = client['Biterite']
analytics= db['Analytics']
staff = db['Staff']

def retrieve_and_save_images(restaurant_id):
    res = str(restaurant_id)
    managers = staff.find({"rest_id": res})

    analytics_data = analytics.find({"restaurant_id": restaurant_id})
    analytics_data = list(analytics_data)

    binary_data1 = analytics_data[0]['Top_items:']
    binary_data2 = analytics_data[0]['status_dist']

    image1 = pickle.loads(binary_data1)
    image2 = pickle.loads(binary_data2)
    return image1,image2
    
# # restaurant_id = int(input("Enter the restaurant Id: "))
# i1,i2=retrieve_and_save_images(restaurant_id)
# i1.savefig(f"restaurant_{restaurant_id}_image1.png", format="png")
# i2.savefig(f"restaurant_{restaurant_id}_image2.png", format="png")
