from flask import request, jsonify, json
import Mongo_Connection
import time
from threading import Thread


def ping():
    return "success"

def place_Order(order_id):
    data = request.get_json(force=True)
    links={
        "payment": "localhost:9090/v3/starbucks/order/" + order_id + "/pay",
        "order":"localhost:9090/v3/starbucks/order/" + order_id
    }
    data['links']=links
    data['id']=order_id
    data['status']="PLACED"
    data['message']="Order has been placed"
    Mongo_Connection.collection.insert_one(data)
    order= Mongo_Connection.collection.find_one({"id": order_id}, {"_id": 0})
    return order

def get_Order(order_id):
    order = Mongo_Connection.collection.find_one({"id": order_id}, {"_id": 0})
    return json.dumps(order)

def get_Orders():
    orders=[]
    cursor = Mongo_Connection.collection.find(projection={'_id':False})
    for document in cursor:
        orders.append(document)

    return json.dumps(orders)

def cancel_Order(order_id):
    order = Mongo_Connection.collection.find_one({"id": order_id}, {"_id": 0})
    print order
    if order is None:
        message={
            'status':"error",
            'message':"Order not found"
        }
        return json.dumps(message)
    else:
        Mongo_Connection.collection.remove({"id": order_id})
        message = {
            'status': "success",
            'message': "Order cancelled"
        }
        return json.dumps(message)

def update_Order(order_id):
    data = request.get_json(force=True)
    Mongo_Connection.collection.update({"id": order_id},{"$set":{"items":data['items']}})   #updating the order
    order = Mongo_Connection.collection.find_one({"id": order_id}, {"_id": 0})
    return json.dumps(order)

def pay_Order(order_id):
    order = Mongo_Connection.collection.find_one({"id": order_id}, {"_id": 0})
    if order['status']=="PAID" or order['status']=="PREPARING" or order['status']=="SERVED" or order['status']=="COLLECTED":
        message={
            'status':"error",
            'message':"Order payment rejected"
        }
        return json.dumps(message)
    else:
        Mongo_Connection.collection.update({'id': order_id}, {"$set": {'status': "PAID", 'message': "Payment Accepted"}})
        Mongo_Connection.collection.update({'id': order_id}, {"$unset": {'links.payment': ''}})
        worker(order_id).start()
        order = Mongo_Connection.collection.find_one({"id": order_id}, {"_id": 0})
        return json.dumps(order)

class worker(Thread):
    def __init__(self,order_id):
        super(worker,self).__init__()
        self.order_id=order_id
    def run(self):
        time.sleep(5)
        Mongo_Connection.collection.update({'id': self.order_id}, {"$set": {'status': "PREPARING",'message':"Order preparations in progress"}})
        time.sleep(2)
        Mongo_Connection.collection.update({'id': self.order_id}, {"$set": {'status': "SERVED",'message':"Order served, waiting for customer pick up"}})
        time.sleep(10)
        Mongo_Connection.collection.update({'id': self.order_id}, {"$set": {'status': "COLLECTED",'message':"Order retrived by customer"}})


