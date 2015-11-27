
var app = angular.module('myApp', ['ui.bootstrap']);
app.controller('PoController', controllerGetPO);
app.controller('SupplierController', supplierController);
app.controller('InventoryController', controllerGetAI);
app.controller('ZoneController', zoneController);


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
  $scope.totalPrice = 0;
  $scope.items = [];
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

  $scope.getTotal = function(){
  	var total = 0;
  	for(var i = 0; i < $scope.items.length; i++){
        var product = $scope.items[i];
        total += product.Total;
    }
    return total;
  }

  $scope.addRow = function(){
  	var name = document.getElementById('product_name').value;
  	var qty = document.getElementById('product_qty').value;
  	var total = Number(document.getElementById('product_price').value);
  	$scope.items.push({'ProductName': name, 'Cost': $scope.PdPrice, 'Qty': qty, 'Total':total});
  	$scope.product_name = '';
  	$scope.PdPrice = 0;
  	$scope.product_qty = 1;
  	$scope.product_price = 0;
	document.getElementById("productPriceSearchForm").reset();

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


// _________________AI______________________
 function controllerGetAI($scope, $http){
    $scope.filteredAI = []
  ,$scope.currentPage = 1
  ,$scope.numPerPage = 10
  ,$scope.maxSize = 5;

  $scope.currentAI = null;
  $scope.hasClickView = false;
 

  // setting Ordering
  $scope.orderByField = 'pd_id.pd_id';
  $scope.reverseSort = 'false';
  
  $scope.getai = function(){
    url = "http://54.179.174.140/api/inventory/search";
    zone_id = $('select[name="zone"]').val();
    product_type = $('select[name="product_type"]').val();
    product_name = $('input[name="product_name"]').val();
    product_status = $('select[name="product_status"]').val();
    url = url + "?zone_id=" + zone_id + "&product_type=" + product_type + "&product_name=" + product_name + "&product_status=" + product_status;
    console.log(url)
    $scope.inventory = [];
    $http.get(url)
      .success(function (response) {
        $scope.inventory = response;
        $scope.filteredAI = $scope.inventory.slice(0, 10);
        console.log(response);
      });
  };
  $scope.optionsvalue = "";
  $scope.getZones = function() {

      url = "http://54.179.174.140/api/zone/search";

      $http.get(url)
          .success(function (response) {
          $scope.zones = response;
          $scope.optionsvalue = response[0];
        });
  };

  $scope.updateAI = function($event){   
    $event.preventDefault()

    url = "http://54.179.174.140/api/inventory/" + $scope.currentAI._id;

    $http.put(url, {
      pd_id: $scope.currentAI.pd_id._id,
      quantity: $scope.currentAI.quantity,
      safety_stock: $scope.currentAI.pd_id.safety_stock,
      zone_id: $scope.currentAI.zone_id._id

    })
      .success(function (response) {
        console.log('succeed AI AIAIAIAIAIAIAIAIAIAIAIAIAIAIIAIIAIAIAIAIA');
        console.log(response+'test');

        $scope.goToMainPage();
      });

  }

  $scope.goToMainPage = function() {
    window.location.href = 'SCN_AI010.html'
  }

  $scope.setCurrentInventory = function(AI){
    $scope.currentAI = AI
    console.log(AI.zone_id);
  }

  $scope.getCurrentInventory = function(){
    $scope.currentAI = response;
  }

  $scope.change = function(zone_id){
    console.log(zone_id);
    $scope.currentAI.zone_id._id = zone_id;
  }

  $scope.check = function(ai){
    alert(ai);
  }

  $scope.hasCurrentAI = function(){
    
    currentAI = $scope.currentAI;
    condition   = !(angular.isUndefined(currentAI) || currentAI === null)
    // console.log("condition "+condition)
    if (condition) {

      $scope.current_pd_type = currentAI.pd_id.pd_type;
      $scope.current_pd_id = currentAI.pd_id.pd_id;
      $scope.current_pd_name = currentAI.pd_id.pd_name;
      $scope.current_zn_id = currentAI.zone_id.zone_id;
      $scope.current_ai_quantity = currentAI.quantity;
      $scope.current_ai_safety = currentAI.pd_id.safety_stock;

      return condition
    } 
    else {
      return condition
    }
  }

  $scope.clickView = function(){
    $scope.hasClickView = true;
  }

  $scope.notClickView = function(){
    $scope.hasClickView = false;
  }

  $scope.checkView = function(){
    return $scope.hasClickView;
  }


   ////////////////////////////////////////////////////////////////
  // setting number of Pagination
 
  
  $scope.numPages = function () {
    console.log($scope.inventory);
    return Math.ceil($scope.inventory.length / $scope.numPerPage);
  };
  $scope.$watch('currentPage + numPerPage', function() {
    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
    , end = begin + $scope.numPerPage;
    
  $scope.filteredAI = $scope.inventory.slice(begin, end);
  });
  ///////////////////////////////////////////////////////////////

  $scope.getai();
  $scope.getZones();  
}

// ZONE CONTROLLER
function zoneController($scope, $http){

  $scope.currentZone = null;
  $scope.options = [
    {
      name: 'Zone type',
      value: ''
    },
    {
      name: 'Type 1',
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

  $scope.filteredZN = []
  ,$scope.currentPage = 1
  ,$scope.numPerPage = 10
  ,$scope.maxSize = 5;

  $scope.getZones = function(){

    zone_type = "?zone_type=" + $scope.searchZoneType;
    zone_name = "&zone_name=" + $scope.searchZoneName;

    url = "http://54.179.174.140/api/zone/search" + zone_type + zone_name;

    $scope.zones = [];
    $http.get(url)
        .success(function (response) {
        $scope.zones = response;
        $scope.filteredZN = $scope.zones.slice(0, 10);
      });
  };

  $scope.createZone = function($event){

    $event.preventDefault()

    url = "http://54.179.174.140/api/zone";
    
    $http.post(url, {
      zone_name: $scope.createZone.zone_name,
      zone_type: $scope.createZone.zone_type,
      zone_desc: $scope.createZone.zone_desc,
      zone_id:   $scope.createZone.zone_id
    })
      .success(function (response) {
        console.log('succeed');
        console.log(response);
        
        $scope.goToMainPage()
      });
  }

  $scope.deleteZone = function($event){

    $event.preventDefault()

    url = "http://54.179.174.140/api/zone/" + $scope.currentZone._id;

    $http.delete(url)
      .success(function (response) {
        console.log('succeed');
        console.log(response);

        $scope.goToMainPage();
      });
  }

  $scope.updateZone = function($event){

    $event.preventDefault()

    url = "http://54.179.174.140/api/zone/" + $scope.currentZone._id;

    $http.put(url, {
      zone_name: $scope.currentZone.zone_name,
      zone_type: $scope.currentZone.zone_type,
      zone_desc: $scope.currentZone.zone_desc,
      zone_id:   $scope.currentZone.zone_id
    })
      .success(function (response) {
        console.log('succeed');
        console.log(response);

        $scope.goToMainPage();
      });
  }

  $scope.didClearButtonPress = function () {
    $scope.searchZoneType = $scope.options[0].value;
    $scope.searchZoneName = '';

    $scope.getZones();
  }

  $scope.goToMainPage = function() {
    window.location.href = 'SCN_ZN010.html'
  }

  $scope.setCurrentZone = function(zone) {
    $scope.currentZone = zone
  }

  $scope.hasCurrentZone = function(){
    return !(angular.isUndefined($scope.currentZone) || $scope.currentZone === null);
  }

  ////////////////////////////////////////////////////////////////
  // setting number of Pagination

  $scope.numPages = function () {
    console.log($scope.zones);
    return Math.ceil($scope.zones.length / $scope.numPerPage);
  };

  $scope.$watch('currentPage + numPerPage', function() {
    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
    , end = begin + $scope.numPerPage;
    
  $scope.filteredZN = $scope.zones.slice(begin, end);
  });

  ///////////////////////////////////////////////////////////////

  // Get zones when first visit
  $scope.didClearButtonPress();
}

// SUPPLY PRODUCT 

function supplyProduct($scope, $http){

  $scope.searchProducts = function(productCode) {
    
    $scope.currentProduct = null;

    angular.forEach($scope.products, function(value, key){
      console.log(value.pd_id.pd_id)
         if(value.pd_id.pd_id == productCode) {
           $scope.currentProduct = value;
           console.log('Found -> ' + $scope.currentProduct.pd_id.pd_id);
         }   
      });
  }

  $scope.supplyProduct = function ($event) {
    $event.preventDefault()
    window.location.href = window.history.back(1);
  }

  $scope.getProducts = function(){
    url = "http://54.179.174.140/api/inventory";
    console.log(url);
    $http.get(url)
      .success(function (response) {
        $scope.products = response;
      });
  };

  $scope.getProducts();
 }


// SUPPLIERS CONTORLLER

function supplierController($scope, $http){

  $scope.currentSupplier = null;

  $scope.getSuppliers = function () {

    code = '?code='  + $scope.searchSupplierCode;
    name = '&name='  + $scope.searchSupplierName;
    stat = '&status=' + $scope.searchSupplierStatus;

    url = "http://54.179.174.140/api/supplier/search";
    url = url + code + name + stat;

    console.log(url);

    $http.get(url)
      .success(function (response) {
        $scope.suppliers = response;
      });
  };

  $scope.createSupplier = function () {
    // TODO


  }
  
  $scope.didClearButtonPress = function () {

    $scope.searchSupplierCode = '';
    $scope.searchSupplierName = '';
    $scope.searchSupplierStatus = '';

    $scope.getSuppliers();
  }  

  $scope.setCurrentSupplier = function (index) {
    $scope.currentSupplier = $scope.suppliers[index];
  }

  $scope.hasCurrentSupplier = function () {
    return !(angular.isUndefined($scope.currentSupplier) || $scope.currentSupplier === null);
  }

  $scope.updateSP = function($event){   
    $event.preventDefault()

    url = "http://54.179.174.140/api/supplier/" + $scope.currentSupplier.pd_id;

    $http.put(url, {
      sp_id: $scope.currentSupplier.sp_id,
      code: $scope.currentSupplier.code,
      name: $scope.currentSupplier.name,
      delivery_day: $scope.currentSupplier.delivery_day,
      address: $scope.currentSupplier.address,
      website: $scope.currentSupplier.website,
      phone: $scope.currentSupplier.phone,
      fax: $scope.currentSupplier.fax,
      sale_person_name: $scope.currentSupplier.sale_person_name,
      sale_person_mobile: $scope.currentSupplier.sale_person_mobile,
      sale_person_email: $scope.currentSupplier.sale_person_email,
      status: $scope.currentSupplier.status,
      logo: $scope.currentSupplier.image

    })
      .success(function (response) {
        console.log('succeed');
        console.log(response);

        $scope.goToMainPage();
      });

  }



  $scope.didClearButtonPress();

}