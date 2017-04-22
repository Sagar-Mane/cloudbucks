var routes = require('express').Router();
var models = require('../config/database')
var url = require('url')
var uuidV1 = require('uuid/v1');
var schedular = require('../app/schedular')

const kongIp = process.argv[2];

function randomId() {
    return uuidV1();
}

function fullUrl(req) {
	  return url.format({
	    protocol: req.protocol,
	    host: ( kongIp ? kongIp : req.get('host')),
	    pathname: '/v3/starbucks'
	  });
}


routes.get('/',function(req, res){
	res.header('Access-Control-Allow-Origin', '*');
	res.send("Health check successful!");
});

routes.all('*', function(req, res, next) {
    // add details of what is allowed in HTTP request headers to the response headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', false);
    res.header('Access-Control-Max-Age', '86400');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    // the next() function continues execution and will move onto the requested URL/URI
    next();
});

routes.options('*', function(req, res) {
    res.sendStatus(200);
});

/*

POST    /order
        Create a new order, and upon success, 
        receive a Location header specifying the new order URI.

GET     /order/{order_id}
        Request the current state of the order specified by the URI.

PUT     /order/{order_id}
        Update an order at the given URI with new information, 
        providing the full representation.

DELETE  /order/{order_id}
        Logically remove the order identified by the given URI.

POST    /order/{order_id}/pay
        Process payment for the order.

GET     /orders
        Get list of Open Orders        

*/

routes.get('/order/:order_id',function(req, res){
	var orderId = req.params.order_id;
	if (orderId.trim.length) {
		var status = '{"status":"error","message":"Order not found."}';
		res.json(JSON.parse(status));
	} else {
		models.instance.Order.find({id:orderId},function(err,order){
			if (err) {
				var status = '{"status":"error","message":"Server Error, Try Again Later."}';
				res.json(JSON.parse(status));
			} else {
				if(order.length==0){
					var status = '{"status":"error","message":"Order not found."}';
					res.json(JSON.parse(status));
				} else {
					res.json(order[0]);
				}
			}
		});
	}
});

routes.get('/orders',function(req, res){
	models.instance.Order.find({}, function(err, order){
		if (err) {
			var staus = '{"status":"error","message":"Server Error, Try Again Later."}';
			res.json(JSON.parse(status));
		} else {
			res.json(order);
		}
	});
});

routes.post('/order',function(req, res){
	var randId = randomId();
	var baseUrl = fullUrl(req);
	console.log(req.body);
	var order = new models.instance.Order({
		id : randId,
		items : {qty:req.body.items[0].qty,name:req.body.items[0].name,milk:req.body.items[0].milk,size:req.body.items[0].size},
		links : {'payment':baseUrl+'/order/'+randId+'/pay','order':baseUrl+'/order/'+randId},
		location : req.body.location,
		message : 'Order has been placed.', 
		status : 'PLACED'
	});
	order.save(function(err){
		if(err) {
			console.log(err);
			var staus = '{"status":"error","message":"Server Error, Try Again Later."}';
			res.json(JSON.parse(status));
		} else {
			schedular();
			res.json(order);
		}
	});
});

routes.post('/order/:order_id/pay',function(req,res) {
	var orderId = req.params.order_id;
	if (orderId.trim.length) {
		var status = '{"status":"error","message":"Order not found."}';
		res.json(JSON.parse(status));
	} else {
		models.instance.Order.findOne({id:orderId},function(err,order){
			if (err) {
				var status = '{"status":"error","message":"Order Payment Rejected."}';
				res.json(JSON.parse(status));
			} else {
				if(!order){
					var status = '{"status":"error","message":"Order not found."}';
					res.json(JSON.parse(status));
				} else {
					var query_obj = {id:order.id};
					if ( order.status==='PLACED' ) {
						var update_value = {status:'PAID',message:'Payment received!'};
						models.instance.Order.update(query_obj, update_value,function(err) {
							if (err) {
								console.log(err);
								var staus = '{"status":"error","message":"Error processing payment."}';
								res.json(JSON.parse(status));
							} else {
								models.instance.Order.update(query_obj, {
								    links:{'$remove':{'payment':''}}
								}, function(err){
								    if(err) {
								    	var staus = '{"status":"error","message":"Error processing payment."}';
										res.json(JSON.parse(status));
								    }
								    models.instance.Order.findOne(query_obj,function(err,ord){
										res.json(ord);
									});
								    schedular();
								});
							}
						});
					} else {
						var status = '{"status":"error","message":"Order Payment Rejected."}';
						res.json(JSON.parse(status));
					}
				}
			}
		});
	}
});

routes.delete('/order/:order_id',function(req,res){
	var orderId = req.params.order_id;
	if (orderId.trim.length) {
		var staus = '{"status":"error","message":"Invalid Order Id."}';
		res.json(JSON.parse(status));
	} else {
		models.instance.Order.findOne({id:orderId},function(err,order){
			//console.log(order.status);
			if (err) {
				var status = '{"status":"error","message":"Error cancelling Order."}';
				res.json(JSON.parse(status));
			} else {
				console.log(order.status);
				if(order.length===0){
					var status = '{"status":"error","message":"No Order to Cancel."}';
					res.json(JSON.parse(status));
				} else if (order.status.trim() !=='PLACED') {
					var status = '{"status":"error","message":"Cannot cancel Order."}';
					res.json(JSON.parse(status));
				} else {
					order.delete(function(err){
						if (err) {
							var status = '{"status":"error","message":"Error cancelling Order."}';
							res.json(JSON.parse(status));
						} else {
							var status = '{"status":"success","message":"Order successfully cancelled."}';
							res.json(JSON.parse(status));
						}
					});
				}
			}
		});	
	}
});

routes.put('/order/:order_id',function(req,res){
	var orderId = req.params.order_id;
	if (orderId.trim.length) {
		var status = '{"status":"error","message":"Order not found."}';
		res.json(JSON.parse(status));
	} else {
		models.instance.Order.findOne({id:orderId},function(err,order){
			if (err) {
				var status = '{"status":"error","message":"Server Error, Try Again Later."}';
				res.json(JSON.parse(status));
			} else {
				if(order.length==0){
					var status = '{"status":"error","message":"Order not found."}';
					res.json(JSON.parse(status));
				} else if (order.status.trim() !=='PLACED') {
					var status = '{"status":"error","message":"Order update rejected."}';
					res.json(JSON.parse(status));
				} else {
					order.location = req.body.location;
					order.items.qty = req.body.items[0].qty;
					order.items.name = req.body.items[0].name;
					order.items.milk = req.body.items[0].milk;
					order.items.size = req.body.items[0].size;
					order.save(function(err){
						if(err) {
							console.log(err);
							var staus = '{"status":"error","message":"Server Error, Try Again Later."}';
							res.json(JSON.parse(status));
						} else {
							res.json(order);
						}
					});
				}
			}
		});
	}
});

module.exports = routes;
