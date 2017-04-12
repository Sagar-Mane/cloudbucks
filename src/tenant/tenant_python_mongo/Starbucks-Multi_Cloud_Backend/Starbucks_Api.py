

from flask import request
import Mongo_Connection


def ping():
    return "success"

def place_Order(x):
    data = request.get_json(force=True)
    Mongo_Connection.collection.insert_one({"id": x, "order": data})
    return data

def get_Order(order_id):
    data = Mongo_Connection.collection.find_one({"id": order_id}, {"_id": 0})
    return data

