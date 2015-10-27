
function mainController($scope) {
  $scope.message = "Hello AngularJS";
  $scope.name = '';
  $scope.purchaseOrder = po;
  $scope.productList = product;
  $scope.pirates = [
    {
      "number": "PD00004",
      "supplierName": "Supplier 2",
      "orderDate": "September 19, 2015",
      "deliverDate": "September 25, 2015",
      "status": "Close",
      "action": "[View]"
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

function getPO($scope, $http){
	$http.get("http://54.179.174.140/api/po_header")
  .success(function (response) {
      $scope.purchaseOrder = response;
    });
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




  var product = [
    {
      "id":"55130500222",
      "name":"Jumrus",
      "picture":"Pee pea",
      "position":"single"
            
    },
    {
      "id":"55130500222",
      "name":"JumrusJa",
      "picture":"purple",
      "position":"single"
            
    },
    {
      "id":"55130500222",
      "name":"JumrusJa",
      "picture":"purple",
      "position":"single"
            
    },{
      "id":"55130500222",
      "name":"JumrusJa",
      "picture":"purple",
      "position":"single"
            
    }
  ];