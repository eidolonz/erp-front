
var app = angular.module('myApp', []);
app.controller('PoController', controllerGetPO);
app.controller('SupplierController', supplierController);
app.controller('InventoryController', controllerGetAI);

function getPO($scope, $http){
	alert("hey");
  $http.get("http://54.179.174.140/api/po_header")
  .success(function (response) {
      $scope.purchaseOrder = response;
    });
  e.preventDefault();
};


function controllerGetPO($scope, $http){
	
	$scope.getpo = function(){
		url = "http://54.179.174.140/api/po_header/search";
		po_id = $('input[name="po_id"]').val();
		order_date = $('input[name="order_date"]').val();
		sp_name = $('input[name="sp_name"]').val();
		po_status = $('select[name="po_status"]').val();
		url = url + "?po_id=" + po_id + "&order_date=" + order_date + "&sp_name=" + sp_name + "&po_status=" + po_status;
		$http.get(url)
	  	.success(function (response) {
	      $scope.purchaseOrder = response;
	      console.log(response);
	    });
	};

	$scope.getpo();

}

function supplierController($scope, $http){
  
  $scope.getSuppliers = function(){
    url         = "http://54.179.174.140/api/supplier";
    // sp_id       = $('input[name="supplier_code"]').val();
    // sp_name     = $('input[name="supplier_name"]').val();
    // sp_status   = $('select[name="supplier_status"]').val();
    // url         = url + "?sp_id=" + sp_id + "&sp_name=" + name + "&status=" + sp_status;
    
    // get เรียก data // post สร้างดาต้า // put อัพเดด // delete ลบ
    
    $http.get(url)
      .success(function (response) {
        $scope.suppliers = response;
      });

    // $http.put(url+'/562e5cfbd6450f2120ed2a73', {
    //   name: 'Test',
    //   logo: 'path image'
    // });

    console.log("http put");
  };

  $scope.getSuppliers();
 }


 // _________________AI______________________
 function controllerGetAI($scope, $http){
  
  $scope.getpo = function(){
    url = "http://54.179.174.140/api/inventory/search";
    zone_id = $('input[name="zone"]').val();
    product_type = $('input[name="product_type"]').val();
    product_name = $('input[name="product_name"]').val();
    product_status = $('select[name="product_status"]').val();
    url = url + "?zone_id=" + po_id + "&order_date=" + product_type + "&sp_name=" + sp_name + "&po_status=" + po_status;
    $http.get(url)
      .success(function (response) {
        $scope.inventory = response;
        console.log(response);
      });
  };

  $scope.getpo();

}
