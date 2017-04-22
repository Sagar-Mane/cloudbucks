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