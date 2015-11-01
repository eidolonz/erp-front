
var app = angular.module('myApp', ['ui.bootstrap']);
app.controller('PoController', controllerGetPO);
app.controller('SupplierController', supplierController);
app.controller('InventoryController', controllerGetAI);


//_______________________ PO ____________________________________
function controllerGetPO($scope, $http){
	// setting Pagination properties
	$scope.filteredPO = []
	,$scope.currentPage = 1
	,$scope.numPerPage = 10
	,$scope.maxSize = 5;

	// setting Ordering
	$scope.orderByField = 'po_id';
	$scope.reverseSort = 'false';

	// get PO from DB
	$scope.getpo = function(){
		url = "http://54.179.174.140/api/po_header/search";
		po_id = $('input[name="po_id"]').val();
		order_date = $('input[name="order_date"]').val();
		sp_name = $('input[name="sp_name"]').val();
		po_status = $('select[name="po_status"]').val();
		url = url + "?po_id=" + po_id + "&order_date=" + order_date + "&sp_name=" + sp_name + "&po_status=" + po_status;
		$scope.purchaseOrder = [];
		$http.get(url)
	  	.success(function (response) {
	      $scope.purchaseOrder = response;
	      $scope.filteredPO = $scope.purchaseOrder.slice(0, 10);
	      console.log(response);
	    });
	};
	$scope.getpo();

	// setting number of Pagination
	$scope.numPages = function () {
		return Math.ceil($scope.purchaseOrder.length / $scope.numPerPage);
	};
	$scope.$watch('currentPage + numPerPage', function() {
		var begin = (($scope.currentPage - 1) * $scope.numPerPage)
		, end = begin + $scope.numPerPage;
    
	$scope.filteredPO = $scope.purchaseOrder.slice(begin, end);
  });



}

app.service('SupplierSearch', function($q, $http){
	var API_URL = 'http://54.179.174.140/api/supplier/search?code=';
	this.searchSupplierCode = function(code, name) {	
		var deferred = $q.defer();
		$http.get(API_URL+code+'&name='+name).then(function(codes){
			var _codes = {};
			var _names = {};
			var codes = codes.data;
			//alert(codes);
			for(var i = 0, len = codes.length; i < len; i++) {
				_codes[codes[i].code] = codes[i].code +' ['+codes[i].name+']';
				
			}
			deferred.resolve(_codes);
		}, function() {
			deferred.reject(arguments);
			});
		return deferred.promise;
	}
	this.searchSupplierName = function( code, name) {	
		var deferred = $q.defer();
		$http.get(API_URL+code+'&name='+name).then(function(names){
			var _names = {};
			var names = names.data;
			console.log(names);
			for(var i = 0, len = names.length; i < len; i++) {
				_names[names[i].name] = '['+names[i].code+'] ' + names[i].name;
			}
			deferred.resolve(_names);
		}, function() {
			deferred.reject(arguments);
			});
		return deferred.promise;
	} 
});
app.controller('SearchSupplier', function($scope, $timeout, SupplierSearch) {
  $scope.selectedSpCode = null;
  $scope.selectedSpName = null;
  $scope.SpNames = {};
  $scope.SpCodes = {};  
  $scope.searchSupplierCode = function(code) {
  	sp_name = $('input[name="supplier_name"]').val();
    SupplierSearch.searchSupplierCode(code, sp_name).then(function(SpCodes){
      $scope.SpCodes = SpCodes;
      console.log(SpCodes);
    });
  }

  $scope.searchSupplierName = function(name) {
  	sp_code = $('input[name="supplier_code"]').val();
	SupplierSearch.searchSupplierName(sp_code, name).then(function(SpNames){
      $scope.SpNames = SpNames;
      //console.log(SpNames);
    });
  }
  $scope.addPdAlert = function(){
  	code = $('input[name="supplier_code"]').val();
  	name = $('input[name="supplier_name"]').val();
  	if(code.length < 1 || name.length < 1){
		alert('Please enter Supplier Code and Supplier Name.');
		}
	}
	// date = $('input[name="datePicker"').val();
	// if(date.slice(0,3) >= Date().getFullYear()){

	// }


});

app.directive('keyboardPoster', function($parse, $timeout){
  var DELAY_TIME_BEFORE_POSTING = 0;
  return function(scope, elem, attrs) {
    
    var element = angular.element(elem)[0];
    var currentTimeout = null;
   
    element.oninput = function() {
      var model = $parse(attrs.postFunction);
      var poster = model(scope);
      
      if(currentTimeout) {
        $timeout.cancel(currentTimeout)
      }
      currentTimeout = $timeout(function(){
        poster(angular.element(element).val());
      }, DELAY_TIME_BEFORE_POSTING)
    }
  }
});
 // _________________SP______________________

function supplierController($scope, $http){
  
  $scope.getSuppliers = function(){
    url         = "http://54.179.174.140/api/supplier/search";
    sp_code     = $('input[name="supplier_code"]').val();
    sp_name     = $('input[name="supplier_name"]').val();
    sp_status   = $('select[name="supplier_status"]').val();
    url         = url + "?code=" + sp_code + "&name=" + sp_name + "&status=" + sp_status;
    console.log(url);

    // get เรียก data // post สร้างดาต้า // put อัพเดด // delete ลบ
    
    $http.get(url)
      .success(function (response) {
        $scope.suppliers = response;
      });

    // $http.put(url+'/562e5cfbd6450f2120ed2a73', {
    //   name: 'Test',
    //   logo: 'path image'
    // });
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
