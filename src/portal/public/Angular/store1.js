/**
 * http://usejsdoc.org/
 */

/**
 * Store 1
 */

var link = 'http://localhost:9090';

angular.module('myapp').controller("store1_controller", function($scope, $http, $route, $rootScope,
		$interval) {
	$scope.success = true;
	console.log("Reporting from store 1 controller nachiket");
	$scope.show = false;
	
	$scope.getOrders = function() {
		$http({
			method : 'GET',
			url : link + '/store1/v3/starbucks/orders',
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
			url : link + '/store2/v3/starbucks/order',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data : OrderDetails
			
		}).success(function(data) {
			console.log("Order PLACED");
		});

	};

	
	$scope.deleteOrder = function(url) {
		console.log("Reporting from delete order " + url);
		$http({
			method : 'DELETE',
			url : url,
		}).success(function(data) {
			console.log("Order DELETED");
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
			console.log("Order UPDATED");
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
