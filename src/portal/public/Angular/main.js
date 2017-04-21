var app = angular.module('myapp', [ 'ngRoute' ]);

var link = 'http://localhost:9090';

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

app.controller("store1_controller", function($scope, $http, $route, $rootScope,
		$interval) {
	$scope.success = true;
	console.log("Reporting from store 1 controller");
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


/**
 * Store 2
 */
app.controller("store2_controller", function($scope, $route, $httpParamSerializer, $http) {
	console.log("Reporting from store 2 controller");
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


/**
 * Store 3
 */
app.controller("store3_controller", function($scope, $route, $http) {
	console.log("Reporting from store 3 controller");

	$scope.success = true;
	$scope.show = false;

	$scope.getOrders = function() {
		$http({
			method : 'GET',
			url : link + '/store3/v3/starbucks/orders',
		}).success(function(data) {
			console.log("Order Paid" + JSON.stringify(data));
			$scope.orders = data;
		});
	};

    $scope.placeOrder = function() {
        console.log("Reporting from place order");
        console.log("Order:\n Name:" + $scope.name + "\nSize:" + $scope.size
            + "\nMilk:" + $scope.milk + "\nQuantity:" + $scope.quantity);
        $http({
            method : 'POST',
            url : link + 'store3/v3/starbucks/order',
            data : {

            }
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
