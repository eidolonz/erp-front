
function mainController($scope) {
  $scope.message = "Hello AngularJS";
  $scope.name = '';
  $scope.purchaseOrder = [
    {
      "number": "PD00001",
      "supplierName": "Supplier 1",
      "orderDate": "September 16, 2015",
      "deliverDate": "September 25, 2015",
      "status": "Open",
      "action": "[View]"

            
    },
    {
      "number": "PD00002",
      "supplierName": "Supplier 4",
      "orderDate": "September 16, 2015",
      "deliverDate": "September 25, 2015",
      "status": "Open",
      "action": "[View]"
            
    },
    {
      "number": "PD00003",
      "supplierName": "Supplier 2",
      "orderDate": "September 16, 2015",
      "deliverDate": "September 25, 2015",
      "status": "Open",
      "action": "[View]"
            
    },
    {
      "number": "PD00004",
      "supplierName": "Supplier 2",
      "orderDate": "September 19, 2015",
      "deliverDate": "September 25, 2015",
      "status": "Close",
      "action": "[View]"
            
    }
  ];
  $scope.pirates = [
    {
      "id": 1,
      "username": "goldroger",
      "name": "Gol D. Roger",
      "position": "Pirate King"
    },
    {
      "id": 2,
      "username": "mrzero",
      "name": "Sir Crocodile",
      "position": "Former-Shichibukai"
    },
    {
      "id": 3,
      "username": "luffy",
      "name": "Monkey D. Luffy",
      "position": "Captain"
    },
    {
      "id": 4,
      "username": "law",
      "name": "Trafalgar D. Water Law",
      "position": "Shichibukai"
    },
    {
      "id": 5,
      "username": "shanks",
      "name": "'Red-Haired' Shanks",
      "position": "The 4 Emperors"
    }
    ];
};

function custCtrl($scope, $http) {
  $http.get("http://www.w3schools.com/angular/customers.php")
  .success(function (response) {$scope.names = response.records;});
};

function getPO(){
	this.purchaseOrder = po;
};

var app = angular.module('myApp', []);
app.controller('MainController', mainController);
app.controller('CustomersCtrl', custCtrl);
app.controller('PoController', getPO);

 
var po = [
    {
      "number": "PD00001",
      "supplierName": "Supplier 1",
      "orderDate": "September 16, 2015",
      "deliverDate": "September 25, 2015",
      "status": "Open",
      "action": "[View]"

            
    },
    {
      "number": "PD00002",
      "supplierName": "Supplier 4",
      "orderDate": "September 16, 2015",
      "deliverDate": "September 25, 2015",
      "status": "Open",
      "action": "[View]"
            
    },
    {
      "number": "PD00003",
      "supplierName": "Supplier 2",
      "orderDate": "September 16, 2015",
      "deliverDate": "September 25, 2015",
      "status": "Open",
      "action": "[View]"
            
    },
    {
      "number": "PD00004",
      "supplierName": "Supplier 2",
      "orderDate": "September 19, 2015",
      "deliverDate": "September 25, 2015",
      "status": "Close",
      "action": "[View]"
            
    }
  ];