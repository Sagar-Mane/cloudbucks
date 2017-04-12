from flask import Flask
from flask import request, jsonify
import uuid
import Starbucks_Api

app = Flask(__name__)

@app.route("/",methods=['GET'])
def main():
    print "Ping Api"
    return jsonify({'Ping': Starbucks_Api.ping()})

@app.route("/starbucks/order", methods=['POST'])
def place_order():
    order_id = uuid.uuid1()
    x = str(order_id)
    data=Starbucks_Api.place_Order(x)
    return jsonify({'order': data})

@app.route("/starbucks/order/<string:order_id>", methods=['GET'])
def get_order(order_id):
    data=Starbucks_Api.get_Order(order_id)
    return jsonify({'order':data})

@app.route("/starbucks/orders", methods=['GET'])
def get_orders():
    data=Starbucks_Api.get_Orders()
    return jsonify({'orders': data})

@app.route("/starbucks/order/<string:order_id>", methods=['DELETE'])
def cancel_order(order_id):
    print order_id
    status=Starbucks_Api.cancel_Order(order_id)
    return jsonify({'status': status})

@app.route("/starbucks/order/<string:order_id>", methods=['PUT'])
def update_order(order_id):
    message=Starbucks_Api.update_Order(order_id)
    return jsonify({'message': message})

@app.route("/starbucks/order/<string:order_id>/pay", methods=['POST'])
def pay_order(order_id):
    message=Starbucks_Api.pay_Order(order_id)
    return jsonify({"message":message})

if __name__ == "__main__":
    print "Python Server Running at port 5000"
    app.run()