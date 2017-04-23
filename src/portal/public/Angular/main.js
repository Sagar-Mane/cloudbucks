var app = angular.module('myapp', [ 'ngRoute' ]);

var link = 'http://54.67.49.112:8000';

app.config(function($routeProvider) {
	console.log("in route provider");
	$routeProvider.when("/store1", {
		templateUrl : "Templates/store.html",
		controller : "store1_controller"
	}).when("/store2", {
		templateUrl : "Templates/store.html",
		controller : "store2_controller"
	}).when("/store3", {
		templateUrl : "Templates/store.html",
		controller : "store3_controller"
	});

});