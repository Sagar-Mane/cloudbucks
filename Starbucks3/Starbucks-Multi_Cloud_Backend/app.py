from flask import Flask, send_file, jsonify

app = Flask(__name__)

order = [
    {
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

]

@app.route("/",methods=['GET'])
def main():
    print "Building order api"
    return jsonify({'order': order})

if __name__ == "__main__":
    print "Python Server Running at port 5000"
    app.run()