/**
 * http://usejsdoc.org/
 */

/**
 * Store 1
 */
angular.module('myapp').controller("store1_controller", function ($scope, $http, $route, $rootScope,
                                                                  $interval) {
    $scope.success = true;
    $scope.show = false;
    $scope.msg_flag = true;

    storeName = "/store1";

    $scope.getOrders = function () {
        $http({
            method: 'GET',
            url: link + storeName + '/v3/starbucks/orders',
        }).success(function (data) {
            $scope.orders = data;
        });
    };

    $scope.placeOrder = function () {
        $scope.msg_flag = true;
        var order = {
            "location": "store-1",
            "items": [{
                "qty": $scope.quantity,
                "name": $scope.name,
                "milk": $scope.milk,
                "size": $scope.size
            }]
        };

        console.log(order);

        $http({
            method: 'POST',
            url: link + storeName + '/v3/starbucks/order',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: order

        }).success(function (data) {
            $scope.msg = "Order placed";
            //message should be displayed that your order has been placed
            //manage this flag in UI
            $scope.msg_flag = false;
            $route.reload();
        });

    };


    $scope.deleteOrder = function (url) {
        $http({
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'DELETE',
            url: url
        }).success(function (data) {
            $scope.msg = "Order cancelled";
            //message should be displayed that your order has been DELETED
            //manage this flag in UI
            $scope.msg_flag = false;
            setTimeout($route.reload(), 1000);
        }).error(function(error, status) {
            $scope.msg = error.message;
            $scope.msg_flag = false;
        });

    };

    $scope.updateOrder = function (url) {
        $scope.msg_flag = true;
        var url = $scope.up_url;
        console.log(url);

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
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'PUT',
            url: url,
            data: order
        }).success(function (data) {
            $scope.msg = 'Order updated';
            //message should be displayed that your order has been placed
            //manage this flag in UI
            $scope.msg_flag = false;
        }).error(function(error, status) {
            console.log(error);
            $scope.msg = error.message;
            $scope.msg_flag = false;
        });

    };

    $scope.showUpdatePopUp = function (url) {
        $scope.up_url = url;
        document.getElementById('id02').style.display='block';
        //document.getElementById('url').value = url;
    }

    $scope.payOrder = function (url) {
        if(!url) {
            $scope.msg = "Can't pay for this order";
            $scope.msg_flag = false;
            return;
        }

        $http({
            method: 'POST',
            url: url,
        }).success(function (data) {
            console.log(data);
            console.log("Order PAID");
            $scope.msg = "Payment done";
            $scope.msg_flag = false;
            console.log("Order PAID");
            $route.reload();
        }).error(function(error, status) {
            console.log(error);
            $scope.msg = error.message;
            $scope.msg_flag = false;
        });
    };
    $scope.getOrders();
});
