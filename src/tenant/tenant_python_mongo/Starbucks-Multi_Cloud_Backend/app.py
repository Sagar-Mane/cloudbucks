
from flask import Flask, json
from flask import jsonify, Response
import uuid
import Starbucks_Api
import sys

app = Flask(__name__)
#print sys.argv[1]+"/v3/starbucks/order/" "id"  "/pay"

@app.route("/",methods=['GET'])
def main():
    print "Ping Api"
    return jsonify({'Ping': Starbucks_Api.ping()})

@app.route("/v3/starbucks/order", methods=['POST'])
def place_order():
    order_id = uuid.uuid1()
    id = str(order_id)
    order=Starbucks_Api.place_Order(id,sys.argv[1])
    resp = Response(json.dumps(order))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route("/v3/starbucks/order/<string:order_id>", methods=['GET'])
def get_order(order_id):
    order=Starbucks_Api.get_Order(order_id)
    resp = Response(order)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route("/v3/starbucks/orders", methods=['GET'])
def get_orders():
    orders=Starbucks_Api.get_Orders()
    resp = Response(orders)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route("/v3/starbucks/order/<string:order_id>", methods=['DELETE'])
def cancel_order(order_id):
    status=Starbucks_Api.cancel_Order(order_id)
    resp = Response(status)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route("/v3/starbucks/order/<string:order_id>", methods=['PUT'])
def update_order(order_id):
    order=Starbucks_Api.update_Order(order_id)
    resp = Response(order)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route("/v3/starbucks/order/<string:order_id>/pay", methods=['POST'])
def pay_order(order_id):
    order=Starbucks_Api.pay_Order(order_id)
    resp = Response(order)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

if __name__ == "__main__":
    print "Python Server Running at port 90"
    app.run(port=90)