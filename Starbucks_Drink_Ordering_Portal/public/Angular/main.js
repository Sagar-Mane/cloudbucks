var app = angular.module('myapp', ['ngRoute']);
app.config(function($routeProvider) {
	console.log("in route provider");
	$routeProvider
	.when("/store1", {
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
app.controller("store1_controller",function($scope,$http,$rootScope){
	$rootScope.bgimg = "https://s-media-cache-ak0.pinimg.com/originals/1b/60/78/1b6078385f4181319017a1b6859fc31c.jpg";
	console.log("Reporting from store 1 controller");
	$scope.success=true;
});

app.controller("store2_controller",function($scope,$http){
	console.log("Reporting from store 2 controller");
});

app.controller("store3_controller",function($scope,$http){
	console.log("Reporting from store 3 controller");
});