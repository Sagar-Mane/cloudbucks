/**
 * http://usejsdoc.org/
 */
/**
 * Store 2
 */

angular.module('myapp').controller("store2_controller", function($scope, $route, $httpParamSerializer, $http) {
	console.log("Reporting from store 2 controller nachiket");
	$scope.success = true;
	$scope.show = false;
	
	$scope.place_order_flag = true;
	$scope.update_order_flag = true;
	$scope.pay_order_flag = true;
	$scope.del_order_flag = true;
	
	$scope.getOrders = function() {
		$http({
			method : 'GET',
			url : link + '/v3/starbucks/orders',
		}).success(function(data) {
			console.log("Order Paid" + JSON.stringify(data));
			$scope.orders = data;
		});
	};

	$scope.placeOrder = function() {
		console.log("Reporting from place order");
		
		var OrderDetails = {
						"location" : "store-1",
						"items" : [ {
						"qty" : $scope.quantity,
						"name" : $scope.name,
						"milk" : $scope.milk,
						"size" : $scope.size
						} ]
					};
		
		console.log(OrderDetails);
		
		$http({
			method : 'POST',
			url : link + '/v3/starbucks/order',
			headers: {'Content-Type': 'application/json; charset=utf-8'},
			//headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data : OrderDetails//$httpParamSerializer(OrderDetails)
		}).success(function(data) {
			 console.log("Order placed");
     		//message should be displayed that your order has been placed
			//manage this flag in UI
			$scope.place_order_flag = false;

		});
	};

    $scope.deleteOrder = function(url) {
        console.log("Reporting from delete order " + url);
        $http({
            method : 'DELETE',
            url : url,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data) {
       		console.log(data);
        	if(data.status === 'error') {
        		$scope.flag_del = data.message;
                $scope.del_order_flag = false;
        	} else {
        		console.log("Order Deleted");
                $scope.flag_del = "Order cancelled"
                //message should be displayed that your order has been DELETED
                //manage this flag in UI
                $scope.del_order_flag = false;
                $route.reload();
                console.log("function deleteOrder ended");
        	}
        });

    };
    
    
    $scope.showUpdatePopUp = function (url) {
    	console.log("inside showUpdatePopUp");
    	console.log(url);
    	$scope.up_url = url;
    	document.getElementById('id02').style.display='block';
    	//document.getElementById('url').value = url;
    	
    }

    $scope.updateOrder = function() {
        console.log("Reporting from update order ");
        //console.log($scope.up_url);
        var url = $scope.up_url;
        console.log(url);
        
		var UpdateOrderDetails = {
				"location" : "store-2",
				"items" : [ {
				"qty" : $scope.up_quantity,
				"name" : $scope.up_name,
				"milk" : $scope.up_milk,
				"size" : $scope.up_size
				} ]
			};
        
		console.log(UpdateOrderDetails);
        
        $http({
            method : 'PUT',
            url : url,
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            data : UpdateOrderDetails//$httpParamSerializer(UpdateOrderDetails)
        }).success(function(data) {
   		 	console.log(data);
        	if (data.status === 'error') {
        		$scope.flag = data.message;
                $scope.update_order_flag = false;
        	} else {
        		console.log("ORDER HAS BEEN UPDATED");
                console.log(data.status);
                $scope.update_order_flag = false;
        	}
        });

    };

    $scope.payOrder = function(url) {
        console.log("Reporting from pay order " + url);
        if(!url) {
            $scope.flag_pay = "Can't pay for this order";
            $scope.pay_order_flag = false;
            return;
        }
        $http({
            method : 'POST',
            url : url,
        }).success(function(data) {
            console.log(data);
            if (data.status==='error') {
            	$scope.flag_pay = data.message;
                $scope.pay_order_flag = false;
            } else {
                console.log(data);
                console.log("Order PAID");
                $scope.flag_pay = "Payment done"
                $scope.pay_order_flag = false;
                console.log("Order PAID");
                $route.reload();
            }
        });
    };
	$scope.getOrders();
});

