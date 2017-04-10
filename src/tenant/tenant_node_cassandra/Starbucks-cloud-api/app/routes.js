var routes = require('express').Router();
var models = require('../config/database')
var url = require('url')

function randomId() {
    return Math.random().toString(32).slice(2);
}

function fullUrl(req) {
	  return url.format({
	    protocol: req.protocol,
	    host: req.get('host'),
	    pathname: 'api/'
	  });
	}

routes.get('/',function(req, res){
	res.send("Health check successful!");
});

/*

POST    /order
        Create a new order, and upon success, 
        receive a Location header specifying the new orderâ€™s URI.

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
	var order = new models.instance.Order({
		id : randId,
		items : {qty:1,name:'latte',milk:'skimmed',size:'tall'},
		links : {'payment':baseUrl+'order/'+randId+'/pay','order':baseUrl+'order/'+randId},
		location : 'take-out',
		message : 'Order has been placed.', 
		status : 'PLACED'
	});
	order.save(function(err){
		if(err) {
			console.log(err);
			var staus = '{"status":"error","message":"Server Error, Try Again Later."}';
			res.json(JSON.parse(status));
		} else {
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
			console.log(order.status);
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
	res.send("check!");
});

module.exports = routes;