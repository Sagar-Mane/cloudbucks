/**
 * http://usejsdoc.org/
 */
/**
 * Store 2
 */

angular.module('myapp').controller("store2_controller", function($scope, $route, $httpParamSerializer, $http) {
	console.log("Reporting from store 2 controller");
	$scope.success = true;
	$scope.show = false;
	
	$scope.msg_flag = true;

    storeName = "/store2";

	$scope.getOrders = function() {
		$http({
			method : 'GET',
			url : link + storeName + '/v3/starbucks/orders',
		}).success(function(data) {
			console.log("Order Paid" + JSON.stringify(data));
			$scope.orders = data;
		});
	};

	$scope.placeOrder = function() {
		console.log("Reporting from place order");
        $scope.msg_flag = true;
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
			url : link + storeName + '/v3/starbucks/order',
			headers: {'Content-Type': 'application/json; charset=utf-8'},
			//headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data : OrderDetails//$httpParamSerializer(OrderDetails)
		}).success(function(data) {
			 console.log("Order placed");
     		//message should be displayed that your order has been placed
			//manage this flag in UI
            $scope.msg_flag = false;
            $route.reload();
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
                $scope.msg = data.message;
                $scope.msg_flag = false;
        	} else {
        		console.log("Order Deleted");
                $scope.msg = "Order cancelled"
                //message should be displayed that your order has been DELETED
                //manage this flag in UI
                $scope.msg_flag = false;
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
        $scope.msg_flag = true;
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
                $scope.msg = data.message;
                $scope.msg_flag = false;
        	} else {
                $scope.msg = 'Order updated';
        		console.log("ORDER HAS BEEN UPDATED");
                console.log(data.status);
                $scope.msg_flag = false;
                setTimeout($route.reload(), 2000);
        	}
        });

    };

    $scope.payOrder = function(url) {
        console.log("Reporting from pay order " + url);
        if(!url) {
            $scope.msg = "Can't pay for this order";
            $scope.msg_flag = false;
            return;
        }
        $http({
            method : 'POST',
            url : url,
        }).success(function(data) {
            console.log(data);
            if (data.status==='error') {
                $scope.msg= data.message;
                $scope.msg_flag = false;
            } else {
                console.log(data);
                console.log("Order PAID");
                $scope.msg = "Payment done"
                $scope.msg_flag = false;
                console.log("Order PAID");
                $route.reload();
            }
        });
    };
	$scope.getOrders();
});

