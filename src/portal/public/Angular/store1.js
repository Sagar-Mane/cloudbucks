/**
 * http://usejsdoc.org/
 */

/**
 * Store 1
 */


angular.module('myapp').controller("store1_controller", function ($scope, $http, $route, $rootScope,
                                                                  $interval) {
    $scope.success = true;
    console.log("Reporting from store 1 controller");
    $scope.show = false;

    $scope.place_order_flag = true;
    $scope.update_order_flag = true;
    $scope.pay_order_flag = true;
    $scope.del_order_flag = true;

    storeName = '/store1';
    $scope.getOrders = function () {
        $http({
            method: 'GET',
            url: link + storeName + '/v3/starbucks/orders',
        }).success(function (data) {
            console.log("Order Paid" + JSON.stringify(data));
            $scope.orders = data;
        });
    };

    $scope.placeOrder = function () {
        console.log("Reporting from place order");

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
            url: link + '/v3/starbucks/order',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: order

        }).success(function (data) {
            console.log("Order placed");
            //message should be displayed that your order has been placed
            //manage this flag in UI
            $scope.place_order_flag = false;
        });

    };


    $scope.deleteOrder = function (url) {
        console.log("Reporting from delete order " + url);
        $http({
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'DELETE',
            url: url
        }).success(function (data) {
            console.log("Order Deleted");
            $scope.flag_del = "Order cancelled"
            //message should be displayed that your order has been DELETED
            //manage this flag in UI
            $scope.del_order_flag = false;
            $route.reload();
            console.log("function deleteOrder ended");
        }).error(function(error, status) {
            console.log(error);
            $scope.flag_del = error.message;
            $scope.del_order_flag = false;
        });

    };

    $scope.updateOrder = function (url) {
        console.log("Reporting from update order " + url);
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

        console.log(order);

        $http({
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'PUT',
            url: url,
            data: order
        }).success(function (data) {
            console.log("ORDER HAS BEEN UPDATED");
            console.log(data.status);

            //message should be displayed that your order has been placed
            //manage this flag in UI
            $scope.update_order_flag = false;
        }).error(function(error, status) {
            console.log(error);
            $scope.flag = error.message;
            $scope.update_order_flag = false;
        });

    };

    $scope.showUpdatePopUp = function (url) {
        console.log("inside showUpdatePopUp");
        console.log(url);
        $scope.up_url = url;
        document.getElementById('id02').style.display='block';
        //document.getElementById('url').value = url;
    }

    $scope.payOrder = function (url) {
        console.log("Reporting from pay order " + url);
        if(!url) {
            $scope.flag_pay = "Can't pay for this order";
            $scope.pay_order_flag = false;
            return;
        }


        $http({
            method: 'POST',
            url: url,
        }).success(function (data) {
            console.log(data);
            console.log("Order PAID");
            $scope.flag_pay = "Payment done"
            $scope.pay_order_flag = false;
            console.log("Order PAID");
            $route.reload();
        }).error(function(error, status) {
            console.log(error);
            $scope.flag_pay = error.message;
            $scope.pay_order_flag = false;
        });
    };
    $scope.getOrders();
});
