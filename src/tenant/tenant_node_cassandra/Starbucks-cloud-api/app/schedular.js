var async = require('async');
var models = require('../config/database')

var isSchedularStarted = 0;


function setOrderStatus(status) {
	var update_value;
	if(status == 'PAID') {
		//make as preparing
		update_value = {status:'PREPARING',message:'Order preparations in progress.!'};
	} else if (status == 'PREPARING') {
		//make as served
		update_value = {status:'SERVED',message:'Order served, wating for Customer pickup.'};
	} else if (status == 'SERVED') {
		//make as collected
		update_value = {status:'COLLECTED',message:'Order retrived by Customer.'};
	}
	return update_value;
}

function startOrderProcessing() {
	async.waterfall([
	    function(callback){
	    	models.instance.Order.find({}, 
	    			function(err, orders){
	    		if (err) {
	    			console.log('Error running Schedular : Step 1');
	    			console.log(err);
	    			orders = JSON.parse('[]');
	    		}
	    		setTimeout(function(){
	    	           callback(null, orders);
	    	    }, 3000);
	    	});
	    },
	    function(orders, callback){
	    	if( orders.length != 0) {
	    		var orderProcessed = 0;
	    		for( i=0; i<orders.length; i++ ) {
	    			if (orders[i].status === 'PAID' || orders[i].status === 'PREPARING' || orders[i].status === 'SERVED') {
	    				var update_value = setOrderStatus(orders[i].status);
						models.instance.Order.update({id:orders[i].id}, update_value,function(err) {
							if (err) {
								console.log("Error running Schedular : Step 2");
							}
						});
						orderProcessed = orderProcessed+1;
	    			}
	    		}
	    		if(orderProcessed === 0){
	    			isSchedularStarted = 0;
	    		}
	    	} else {
	    		isSchedularStarted = 0;
	    	}
	        setTimeout(function(){
	            callback(null);
	        }, 30000);
	    }
	],
	function(err) {
		if(isSchedularStarted) {
			setTimeout(function(){
	            startOrderProcessing();
	        }, 3000);
		} else {
			console.log('Order processing stopped!');
		}
	});
}

var schedular = function(){
	if(!isSchedularStarted) {
		isSchedularStarted = 1;
		console.log('Order processing started!');
		startOrderProcessing();
	}
};
module.exports = schedular;