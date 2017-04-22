/**
 * http://usejsdoc.org/
 */
/**
 * Store 2
 */

var link = 'http://localhost:9090';

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
			console.log("ORDER PLACE RESULT");
			console.log(data);
			
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
            console.log("DELETED RESULT");
            console.log(data);            console.log(data.status);
            
            if (data.status == "error"){
            	$scope.flag_del = "DELETE ERROR! CANT DELETE A COMPLETED ORDER"
            } else {
            	$scope.flag_del = "ORDER DELETED!"
            }
            
            //message should be displayed that your order has been DELETED
			//manage this flag in UI           
            $scope.del_order_flag = false;

            console.log("function deleteOrder ended");
            
            //setTimeout($route.reload(), 3000);
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
            console.log("ORDER HAS BEEN UPDATED");
            console.log(data.status);
            
            if (data.status == "error"){
            	$scope.flag = "UPDATE ERROR! CANT DO THAT!"
            } else {
            	$scope.flag = "Hey! Congratulations! Your order has been" +
								"successfully<br> UPDATED! <br> Sit back and Enjoy" +
								"till we brew you the finest coffee!"
            }
            
            //message should be displayed that your order has been placed
			//manage this flag in UI
			$scope.update_order_flag = false;
        });

    };

    $scope.payOrder = function(url) {
        console.log("Reporting from pay order " + url);
        $http({
            method : 'POST',
            url : url,
        }).success(function(data) {
            console.log(data);
            
            console.log(data.status);
            
            if (data.status == "error"){
            	$scope.flag_pay = "PAYMENT ERROR! CANT PAY A PAID ORDER"
            } else {
            	$scope.flag_pay = "WE GOT THE MONEY! NOW YOU GET THE COFFEE"
            }
            
            //message should be displayed that your order has been PAID
			//manage this flag in UI           
            $scope.pay_order_flag = false;

            console.log("Order PAID");
            //setTimeout($route.reload(), 3000);
        });
    };
	$scope.getOrders();
});

