var app = angular.module('myapp', ['ngRoute']);
app.config(function($routeProvider) {
	console.log("in route provider");
	$routeProvider
	.when("/store1", {
		templateUrl : "Templates/store1.html",
		controller : "store1_controller"
	})
});
app.controller("store1_controller",function($scope,$http){
	console.log("Reporting from store 1 controller");
});