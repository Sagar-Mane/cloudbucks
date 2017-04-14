from json import dumps

from flask import request, jsonify, json
import Mongo_Connection


def ping():
    return "success"

def place_Order(x):
    data = request.get_json(force=True)
    data['id']=x
    print data
    Mongo_Connection.collection.insert_one({"order":data})
    return data

def get_Order(order_id):
    data = Mongo_Connection.collection.find_one({"order.id": order_id}, {"_id": 0})
    return data

def get_Orders():
    data=[]
    cursor = Mongo_Connection.collection.find(projection={'_id':False})
    for document in cursor:
        data.append(document)
    print "Printing array data",data

    return jsonify({'orders':data})

def cancel_Order(order_id):
    print "Cancelling order with id",order_id
    Mongo_Connection.collection.remove({"id":order_id})
    return "Order Cancelled"

def update_Order(order_id):
    print "Updating order with id",order_id
    data = request.get_json(force=True)
    print data
    Mongo_Connection.collection.update({'id':order_id}, {"$set": data}, upsert=False)    #updating the order
    return "Order Updated"

def pay_Order(order_id):
    print "Paying for the order with id",order_id
    Mongo_Connection.collection.update({'order.id': order_id}, {"$set": {'order.status': "Paid"}})
    return "Order Status Paid"
