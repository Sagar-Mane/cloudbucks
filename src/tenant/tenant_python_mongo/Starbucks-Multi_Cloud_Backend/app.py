from flask import Flask, request, jsonify
import uuid
from pymongo import MongoClient
import pprint
client = MongoClient('mongodb://localhost:27017/')
db = client.starbucks   #database
collection = db.orders  #collection
app = Flask(__name__)

order ={
        "id": 1,
        "location": "take-out",
        "items":[
            {'qty':1, "name": "latte", "milk": "whole", "size": "large"}
        ],
        "links":[
            {'payment':"haha", "order":"hihahaha"}
        ],
        "status":"Placed",
        "message":"Order has been placed"
    }
#collection.insert_one(order)    #inserting json object order
"""get_order=collection.find_one({"status":"Placed"})
print get_order['status']       #accessing key and values
get_order['status']="invalid"
collection.save(get_order)
print get_order['status']
collection.update({'_id':"58ea889c4399413f64282191"}, {"$set": get_order}, upsert=False)    #updating the order
"""
#pprint.pprint(collection.find_one({"status":"Placed"})) #Querying the order


@app.route("/",methods=['GET'])
def main():
    print "Building order api"
    return jsonify({'order': order})

@app.route("/starbucks/order", methods=['POST'])
def place_order():
    print "Reporting from place order api"
    #print "Incoming data=",request.data        //Ref For angular incoming data
    order_id=uuid.uuid1()
    print order_id
    data = request.get_json(force = True)
    collection.insert_one({"id":order_id,"order":data})

    pprint.pprint(collection.find_one({"id": "8700e90f-1e45-11e7-a389-48e244a14b48"}))

    #print data
    return jsonify({'order': data})



if __name__ == "__main__":
    print "Python Server Running at port 5000"
    app.run()