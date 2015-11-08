
var app = angular.module('myApp', ['ui.bootstrap']);
app.controller('PoController', controllerGetPO);
app.controller('SupplierController', supplierController);
app.controller('InventoryController', controllerGetAI);
app.controller('ZoneController', zoneController)

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

// Supplier Controller
function supplierController($scope, $http, CurrentSupplier){

	$scope.getCurrentSupplier = function(){
  		return CurrentSupplier.get();
  	}

  	$scope.setCurrentSupplier = function(data){
  		CurrentSupplier.set(data);
  	}

  	$scope.hasCurrentSupplier = function(){
  		return angular.isUndefined(CurrentSupplier.get()) || CurrentSupplier.get() === null 
  	}	

 	$scope.getSuppliers = function(){
    	url         = "http://54.179.174.140/api/supplier/search";
    	sp_code     = $('input[name="supplier_code"]').val();
    	sp_name     = $('input[name="supplier_name"]').val();
    	sp_status   = $('select[name="supplier_status"]').val();
    	url         = url + "?code=" + sp_code + "&name=" + sp_name + "&status=" + sp_status;

    	$http.get(url)
      		.success(function (response) {
        	$scope.suppliers = response;
      	});
	};

	$scope.createSupplier = function(){

		filePath = $('input[name="logo"]').val();
		console.log(filePath);

		$http({
			method: "post",
			url: "http://54.179.174.140/api/supplier/",
			transformRequest: transformRequestAsFormPost,
				data: {
					logo: filePath,
					sp_id: "asdfsaf",
					code: "asdfasdf",
					delivery_day: "afasdf",
					name: "asfasf",
					address: "afsasdf",
					name: "asdfsadf",
					address: "asdfasfd",
					website: "asfasdf",
					phone: "asdfasdf",
					fax: "asdfsfd",
					sale_person_name: "asdfasdf",
					sale_person_mobile: "asff",
					sale_person_email: "asdsadf",
					status: "Best Friend"
				}
		})
    	.then(function(response) {
        	console.log(response)
    	}, 
    	function(response) { // optional
            console.log(response)
    	});
	}

	$scope.updateSupplier = function(){
    	
	};

	$scope.getSuppliers();
}

app.factory('CurrentSupplier', function() {
	
	var supplier;
 	
 	function set(data) {
   		supplier = data;
 	}
 
 	function get() {
  		return supplier;
 	}

 	return {
  		set: set,
  		get: get
 	}
});

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

// ZONE CONTROLLER
function zoneController($scope, $http, CurrentItem){

	$scope.options = [
		{
			name: 'Zone type',
			value: ''
		},
		{
			name: 'Type 1 ',
   			value: 'type1'
		}, 
		{
   			name: 'Type 2',
   			value: 'type2'
		},
		{
   			name: 'Type 3',
   			value: 'type3'
		},
		{
   			name: 'Type 4',
   			value: 'type4'
		}
		];

 	$scope.getZones = function(zone_type, zone_name){

 		if (angular.isUndefined(zone_type)) {
 			zone_type = ''
 		}

 		if (angular.isUndefined(zone_name)) {
 			zone_name = ''
 		}

 		console.log('getZones ' + zone_name + ' ' + zone_type)

    	url = "http://54.179.174.140/api/zone/search";
    	url = url + "?zone_type=" + zone_type + "&zone_name=" + zone_name;

    	$http.get(url)
      		.success(function (response) {
        	$scope.zones = response;
      	});
	};

	$scope.resetForm = function(){
		$scope.zone_name = '';
		$scope.zone_type = $scope.options[0].value;

		$scope.getZones();
	}

	$scope.createZone = function(type, code, name, desc){

		url = "http://54.179.174.140/api/zone";
		console.log('create zone');
		
		$http.post(url, {
			zone_name: name,
  			zone_type: type,
  			zone_desc: desc,
  			zone_id:   code
		})
    	.success(function (response) {
    		console.log('succeed');
        	console.log(response);
    	});
	}

	$scope.deleteZone = function(id){

		url = "http://54.179.174.140/api/zone/" + id;

		console.log('delete zone');

		$http.delete(url)
    	.success(function (response) {
    		console.log('succeed');
        	console.log(response);
    	});
	}

	$scope.updateZone = function(id){
		url = "http://54.179.174.140/api/zone/" + id;

		console.log('update zone : ')
		console.log(url);
		
		type = $scope.current_zone_type
		code = $('input[name="edit_zone_code"]').val();
    	name = $('input[name="edit_zone_name"]').val();
		desc = $('textarea[name="edit_zone_desc"]').val();

		console.log(type)
		console.log(code)
		console.log(name)
		console.log(desc)

		$http.put(url, {
			zone_name: name,
  			zone_type: type,
  			zone_desc: desc,
  			zone_id:   code
		})
    	.success(function (response) {
    		console.log('succeed');
        	console.log(response);
    	});
	}

	$scope.setCurrentZone = function(zone){
		CurrentItem.set(zone);
	}

	$scope.getCurrentZone = function(zone){
		return CurrentItem.get()
	}

	$scope.hasCurrentZone = function(){
		
		currentZone = $scope.getCurrentZone()
		condition   = !(angular.isUndefined(currentZone) || currentZone === null)

		if (condition) {

			$scope.current_zone_type = currentZone.zone_type;
			$scope.current_zone_name = currentZone.zone_name;
			$scope.current_zone_code = currentZone.zone_id;
			$scope.current_zone_desc = currentZone.zone_desc;

			return condition
		} 
		else {
			return condition
		}
	}


	$scope.getZones();
}

app.factory('CurrentItem', function() {
	
	var item;
 	
 	function set(data) {
   		item = data;
 	}
 
 	function get() {
  		return item;
 	}

 	return {
  		set: set,
  		get: get
 	}
});