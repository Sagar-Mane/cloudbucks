/**
 * http://usejsdoc.org/
 */

/**
 * Store 3
*/

var link = 'http://localhost:90';


angular.module('myapp').controller("store3_controller", function($scope, $route, $http, $httpParamSerializer) {
	console.log("Reporting from store 3 controller nachiket");

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
						"location" : "store-3",
						"items" : [ {
						"qty" : $scope.quantity,
						"name" : $scope.name,
						"milk" : $scope.milk,
						"size" : $scope.size
						} ]
					};
		$http({
			method : 'POST',
			url : link + '/v3/starbucks/order',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data : OrderDetails
		}).success(function(data) {
			console.log("ORDER PLACE RESULT");
			console.log(data);
            setTimeout($route.reload(), 3000);
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
            console.log(data);
            if (data.status == "error"){
            	$scope.flag_del = data.message
            }
            $scope.del_order_flag = false;
        });

    };

    $scope.updateOrder = function() {
        console.log("Reporting from update order " + url);
        var url = $scope.up_url;
        var order = {
                "location" : "store-1",
                "items" : [ {
                    "qty" : $scope.up_quantity,
                    "name" : $scope.up_name,
                    "milk" : $scope.up_milk,
                    "size" : $scope.up_size
                } ]
            };
        $http({
            method : 'PUT',
            url : url,
            data : order
        }).success(function(data) {
            console.log("UPDATED RESULT");
            console.log(data);
            if (data.status == "error"){
            	$scope.flag = "UPDATE ERROR! CANT DO THAT!"
            } else {
            	$scope.flag = "Hey! Congratulations! Your order has been" +
								"successfully<br> UPDATED! <br> Sit back and Enjoy" +
								"till we brew you the finest coffee!"
            }
            $scope.update_order_flag = false;
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
    
    $scope.showUpdatePopUp = function (url) {
        console.log("inside showUpdatePopUp");
        console.log(url);
        $scope.up_url = url;
        document.getElementById('id02').style.display='block';
        //document.getElementById('url').value = url;
    }
    
	$scope.getOrders();
});
