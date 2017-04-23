/**
 * http://usejsdoc.org/
 */

/**
 * Store 3
*/

angular.module('myapp').controller("store3_controller", function($scope, $route, $http, $httpParamSerializer) {
	console.log("Reporting from store 3 controller nachiket");

	$scope.success = true;
	$scope.show = false;

    $scope.msg_flag = true;

    storeName = "/store3";

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
        $scope.msg_flag = true;
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
			url : link + storeName + '/v3/starbucks/order',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data : OrderDetails
		}).success(function(data) {
            $scope.msg = "Order placed";
			console.log("ORDER PLACE RESULT");
			console.log(data);
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
            console.log("DELETED RESULT");
            console.log(data);
            if (data.status == "error"){
                $scope.msg = data.message
            }
            $scope.msg_flag = false;
        });

    };

    $scope.updateOrder = function() {
        $scope.msg_flag = true;
        console.log("Reporting from update order " + url);
        var url = $scope.up_url;
        var order = {
                "location" : "store-3",
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
                $scope.msg = data.message
            } else {
                $scope.msg = "Order updated"
            }
            $scope.msg_flag = false;
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
            	$scope.flag_pay = data.message;
                $scope.pay_order_flag = false;
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
    
    $scope.showUpdatePopUp = function (url) {
        console.log("inside showUpdatePopUp");
        console.log(url);
        $scope.up_url = url;
        document.getElementById('id02').style.display='block';
        //document.getElementById('url').value = url;
    }
    
	$scope.getOrders();
});
