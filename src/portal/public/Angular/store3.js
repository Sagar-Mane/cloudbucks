/**
 * http://usejsdoc.org/
 */

/**
 * Store 3
*/

var link = 'http://localhost:9090';

angular.module('myapp').controller("store3_controller", function($scope, $route, $http) {
	console.log("Reporting from store 3 controller nachiket");

	$scope.success = true;
	$scope.show = false;

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
		$http({
			method : 'POST',
			url : link + '/v3/starbucks/order',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data : $httpParamSerializer(OrderDetails)
		}).success(function(data) {
			console.log("ORDER PLACE RESULT");
			console.log(data);
            setTimeout($route.reload(), 3000);
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
            setTimeout($route.reload(), 3000);
        });

    };

    $scope.updateOrder = function(url) {
        console.log("Reporting from update order " + url);
        $http({
            method : 'PUT',
            url : url,
            data : {
            }
        }).success(function(data) {
            console.log("UPDATED RESULT");
            console.log(data);
            setTimeout($route.reload(), 3000);
        });

    };

    $scope.payOrder = function(url) {
        console.log("Reporting from pay order " + url);
        $http({
            method : 'POST',
            url : url,
        }).success(function(data) {
            console.log(data);
            console.log("Order PAID");
            setTimeout($route.reload(), 3000);
        });
    };
	$scope.getOrders();
});
