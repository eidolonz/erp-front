
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
				// _codes[codes[i].code] = codes[i].code +' ['+codes[i].name+']';
				_codes[codes[i].code] = codes[i].code;
				
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
				// _names[names[i].name] = '['+names[i].code+'] ' + names[i].name;
				_names[names[i].name] = names[i].name;
			}
			deferred.resolve(_names);
		}, function() {
			deferred.reject(arguments);
			});
		return deferred.promise;
	} 
	//search ProductPrice
	var API_URL2 = 'http://54.179.174.140/api/price/search?sp_code=';
	this.searchProductPriceCode = function(sp_code, code, name) {	
		var deferred = $q.defer();
		$http.get(API_URL2+sp_code+'&pd_code='+code+'&pd_name='+name).then(function(codes){
			var _codes = {};
			var _names = {};
			var codes = codes.data;
			//alert(codes);
			for(var i = 0, len = codes.length; i < len; i++) {
				// _codes[codes[i].code] = codes[i].code +' ['+codes[i].name+']';
				_codes[codes[i].code] = codes[i].pd_id.pd_id;
				
			}
			deferred.resolve(_codes);
		}, function() {
			deferred.reject(arguments);
			});
		return deferred.promise;
	}
	this.searchProductPriceName = function(sp_code, code, name) {	
		var deferred = $q.defer();
		$http.get(API_URL2+sp_code+'&pd_code='+code+'&pd_name='+name).then(function(names){
			var _names = {};
			var names = names.data;
			console.log(names);
			for(var i = 0, len = names.length; i < len; i++) {
				// _names[names[i].name] = '['+names[i].code+'] ' + names[i].name;
				_names[names[i].name] = names[i].pd_id.pd_name;
			}
			deferred.resolve(_names);
		}, function() {
			deferred.reject(arguments);
			});
		return deferred.promise;
	}
	this.searchProductPrice = function(sp_code, code, name) {	
		var deferred = $q.defer();
		$http.get(API_URL2+sp_code+'&pd_code='+code+'&pd_name='+name).then(function(prices){
			var _prices = {};
			var prices = prices.data;
			console.log(prices);
			for(var i = 0, len = prices.length; i < len; i++) {
				// _names[names[i].name] = '['+names[i].code+'] ' + names[i].name;
				_prices[prices[i].code] = prices[i].pd_price;
			}
			deferred.resolve(_prices);
		}, function() {
			deferred.reject(arguments);
			});
		return deferred.promise;
	} 
});
app.controller('SearchSupplier',function($scope, $timeout, SupplierSearch){
  $scope.selectedSpCode = null;
  $scope.selectedSpName = null;
  $scope.selectedPdCode = null;
  $scope.selectedPdName = null;
  $scope.SpNames = {};
  $scope.SpCodes = {};
  $scope.PdNames = {};
  $scope.PdCodes = {};
  $scope.PdPrice = 0;
  $scope.searchSupplierCode = function(code) {
  	sp_name = $('input[name="supplier_name"]').val();
    SupplierSearch.searchSupplierCode(code, "").then(function(SpCodes){
      $scope.SpCodes = SpCodes;
      document.getElementById('supplier_name').value = "";
      SupplierSearch.searchSupplierName(code, "").then(function(SpNames){
      	for (key in SpNames){
      		if(SpNames.hasOwnProperty(key)){
      			var value = SpNames[key];
      			document.getElementById('supplier_name').value = value;
      		}else{      			
      			document.getElementById('supplier_name').value = "";
      		}
      	}
      });
    });
  }

  $scope.searchSupplierName = function(name) {
  	sp_code = $('input[name="supplier_code"]').val();
	SupplierSearch.searchSupplierName("", name).then(function(SpNames){
      $scope.SpNames = SpNames;
      document.getElementById('supplier_code').value = "";
      SupplierSearch.searchSupplierCode("", name).then(function(SpCodes){
      	for (key in SpCodes){
      		if(SpCodes.hasOwnProperty(key)){
      			var value = SpCodes[key];
      			document.getElementById('supplier_code').value = value;
      		}else{      			
      			document.getElementById('supplier_code').value = "";
      		}
      	}
      });
      //console.log(SpNames);
    });
  }
  $scope.searchProductPriceCode = function(code) {
  	pd_name = $('input[name="product_name"]').val();
    SupplierSearch.searchProductPriceCode(document.getElementById('supplier_code').value, code, "").then(function(PdCodes){
      $scope.PdCodes = PdCodes;
      document.getElementById('product_name').value = "";
      SupplierSearch.searchProductPriceName(document.getElementById('supplier_code').value, code, "").then(function(PdNames){
      	for (key in PdNames){
      		if(PdNames.hasOwnProperty(key)){
      			var value = PdNames[key];
      			document.getElementById('product_name').value = value;
      		}else{      			
      			document.getElementById('product_name').value = "";
      		}
      	}
      });
      document.getElementById('product_price').value = "";
      SupplierSearch.searchProductPrice(document.getElementById('supplier_code').value, code, "").then(function(PdPrices){
      	for (key in PdPrices){
      		if(PdPrices.hasOwnProperty(key)){
      			var value = PdPrices[key];
  				$scope.PdPrice = value;
      			document.getElementById('product_price').value = value;
      		}else{      			
      			document.getElementById('product_price').value = "";
      		}
      	}
      });
    });
  }

  $scope.searchProductPriceName = function(name) {
  	pd_code = $('input[name="product_code"]').val();
	SupplierSearch.searchProductPriceName(document.getElementById('supplier_code').value,"", name).then(function(PdNames){
      $scope.PdNames = PdNames;
      document.getElementById('product_code').value = "";
      SupplierSearch.searchProductPriceCode(document.getElementById('supplier_code').value,"", name).then(function(PdCodes){
      	for (key in PdCodes){
      		if(PdCodes.hasOwnProperty(key)){
      			var value = PdCodes[key];
      			document.getElementById('product_code').value = value;
      		}else{      			
      			document.getElementById('product_code').value = "";
      		}
      	}
      });
      document.getElementById('product_price').value = "";
      SupplierSearch.searchProductPrice(document.getElementById('supplier_code').value, code, "").then(function(PdPrices){
      	for (key in PdPrices){
      		if(PdPrices.hasOwnProperty(key)){
      			var value = PdPrices[key];
  				$scope.PdPrice = value;
      			document.getElementById('product_price').value = value;
      		}else{      			
      			document.getElementById('product_price').value = "";
      		}
      	}
      });
      //console.log(SpNames);
    });
  }
  $scope.addProductPrice = function(){
  	var qty = document.getElementById('product_qty').value;
  	document.getElementById('product_price').value = $scope.PdPrice * qty;
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
      currentTimeout = $timeout(function($modal){
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
  
  $scope.getai = function(){
    url = "http://54.179.174.140/api/inventory/search";
    zone_id = $('select[name="zone"]').val();
    product_type = $('select[name="product_type"]').val();
    product_name = $('input[name="product_name"]').val();
    product_status = $('select[name="product_status"]').val();
    url = url + "?zone_id=" + zone_id + "&product_type=" + product_type + "&product_name=" + product_name + "&product_status=" + product_status;
    console.log(url)
    $http.get(url)
      .success(function (response) {
        $scope.inventory = response;
        console.log(response);
      });
  };

  $scope.getai();

}

