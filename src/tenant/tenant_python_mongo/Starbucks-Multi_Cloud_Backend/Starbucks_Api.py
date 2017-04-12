

from flask import request


from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client.starbucks   #database
collection = db.orders  #collection

def ping():
    return "success"

def place_Order(x):
    data = request.get_json(force=True)
    collection.insert_one({"id": x, "order": data})
    return data

def get_Order(order_id):
    data = collection.find_one({"id": order_id}, {"_id": 0})
    return data

