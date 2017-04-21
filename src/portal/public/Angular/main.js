var app = angular.module('myapp', [ 'ngRoute' ]);
app.config(function($routeProvider) {
	console.log("in route provider");
	$routeProvider.when("/store1", {
		templateUrl : "Templates/store1.html",
		controller : "store1_controller"
	}).when("/store2", {
		templateUrl : "Templates/store2.html",
		controller : "store2_controller"
	}).when("/store3", {
		templateUrl : "Templates/store3.html",
		controller : "store3_controller"
	});

});

app
		.controller(
				"store1_controller",
				function($scope, $http, $rootScope, $interval) {
					$scope.success = true;
					console.log("Reporting from store 1 controller");
					$scope.show = false;
					$scope.getOrders = function() {
						$http(
								{
									method : 'GET',
									url : 'http://52.53.220.34:8000/store1/v3/starbucks/orders',
								}).success(function(data) {
							console.log("Order Paid" + JSON.stringify(data));
							$scope.orders = data;
						});
					};

					$scope.getOrders();

					$scope.placeOrder = function() {
						console.log("Reporting from place order");
						console.log("Order:\n Name:" + $scope.name + "\nSize:"
								+ $scope.size + "\nMilk:" + $scope.milk
								+ "\nQuantity:" + $scope.quantity);
						$http(
								{
									method : 'POST',
									url : 'http://54.183.220.137:90/v3/starbucks/order',
									data : {

									}
								}).success(function(data) {
							console.log("Order PLACED");
						});

					};
					$scope.deleteOrder = function(order_id) {
						console.log("Reporting from delete order" + order_id);
						$http(
								{
									method : 'DELETE',
									url : 'http://54.183.220.137:90/v3/starbucks/order/<string:order_id>',
								}).success(function(data) {
							console.log("Order DELETED");
						});

					};
					$scope.updateOrder = function(order_id) {
						console.log("Reporting from update order" + order_id);
						$http(
								{
									method : 'PUT',
									url : 'http://54.183.220.137:90/v3/starbucks/order/<string:order_id>',
									data : {

									}
								}).success(function(data) {
							console.log("Order UPDATED");
						});

					};
					$scope.payOrder = function(order_id) {
						console.log("Reporting from pay order" + order_id);
						$http(
								{
									method : 'POST',
									url : 'http://54.183.220.137:90/v3/starbucks/order/<string:order_id>',
								}).success(function(data) {
							console.log("Order PAID");
						});
					};
				});

app.controller("store2_controller", function($scope, $route, $http) {
	console.log("Reporting from store 2 controller");
	$scope.success = true;
	$scope.show = false;

	$scope.getOrders = function() {
		$http({
			method : 'GET',
			url : 'http://52.53.220.34:8000/store2/v3/starbucks/orders',
		}).success(function(data) {
			console.log("Order Paid" + JSON.stringify(data));
			$scope.orders = data;
		});
	};
	$scope.payOrder = function(order_id) {
		console.log("Reporting from pay order" + order_id);
		$http(
				{
					method : 'POST',
					url : 'http://52.53.220.34:8000/store2/v3/starbucks/order/'+order_id+'/pay',
				}).success(function(data) {
					console.log(data);
					console.log("Order PAID");
					setTimeout($route.reload(),3000);
		});
	};
	$scope.getOrders();
});

app.controller("store3_controller", function($scope, $http) {
	console.log("Reporting from store 3 controller");

	$scope.success = true;
	$scope.show = false;

	$scope.getOrders = function() {
		$http({
			method : 'GET',
			url : 'http://52.53.220.34:8000/store2/v3/starbucks/orders',
		}).success(function(data) {
			console.log("Order Paid" + JSON.stringify(data));
			$scope.orders = data;
		});
	};

	$scope.getOrders();

});
