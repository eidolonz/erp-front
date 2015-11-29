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

app.service('SupplierSearch', function($q, $http, $window){
 

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
  this.searchSupplierId = function( code, name) { 
    var deferred = $q.defer();
    $http.get(API_URL+code+'&name='+name).then(function(ids){
      var _ids = {};
      var ids = ids.data;
      console.log(ids);
      for(var i = 0, len = ids.length; i < len; i++) {
        // _names[names[i].name] = '['+names[i].code+'] ' + names[i].name;
        _ids[ids[i]._id] = ids[i]._id;
      }
      deferred.resolve(_ids);
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
  this.searchProductId = function(sp_code, code, name){
    var deferred = $q.defer();
    $http.get(API_URL2+sp_code+'&pd_code='+code+'&pd_name='+name).then(function(pdIds){
      var _pdIds = {};
      var pdIds = pdIds.data;
      console.log(pdIds);
      for(var i = 0, len = pdIds.length; i < len; i++) {
        // _names[names[i].name] = '['+names[i].code+'] ' + names[i].name;
        _pdIds[pdIds[i].pd_id._id] = pdIds[i].pd_id._id;
      }
      deferred.resolve(_pdIds);
    }, function() {
      deferred.reject(arguments);
      });
    return deferred.promise;
  }
  this.createPO = function(po_id, sp_id, order_date, expected_date,untaxed_total, total,po_status,transLists){

    // $event.preventDefault()
    console.log('create po_htransaction');
    console.log('po_id: ' + po_id);
    console.log('sp_id: ' + sp_id);
    console.log('order: ' + order_date);
    console.log('expected_date: ' + expected_date);
    console.log('total: ' + total);
    console.log('po_status: ' + po_status );
    // console.log('invoice_no: ' + invoice_no);
    console.log(transLists);
    
    url = "http://54.179.174.140/api/po_transaction";
    $http.post(url, {
        'po_id': po_id,
        'sp_id': sp_id,
        'order_date': order_date,
        'expected_date': expected_date,
        'untaxed_total': untaxed_total,
        'total': total,
        'po_status': po_status,
        // 'invoice_no': invoice_no,
        'transactions': transLists
    })
      .success(function (response){
        console.log('succeed');
        console.log(response);
        if(response == 'Created'){
          // $window.location.href = '/Users/JUMRUS/Desktop/DSD/SCN_PO010.html';
          $window.location.href = '/Users/JUMRUS/Desktop/DSD/PO_Report.html';
        }else{
          alert(response);
        }
      })
      .error(function (response){
        console.log('error');
        console.log(response);
      });
  } 
});
app.controller('SearchSupplier',function($scope, $timeout, SupplierSearch, $window, $http, $dialog){
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
  $scope.pd_id = null;
  $scope.sp_id = null;
  $scope.items = [];
  $scope.products = [];
  $scope.poSize = 0;
  $scope.poName = null;

    
    
  
  $scope.getpoSize = function(){
    url = "http://54.179.174.140/api/po_header/search";
    var poSizes = 1,key;
    $http.get(url)
      .success(function (response) {
        for (key in response){
          if(response.hasOwnProperty(key)) poSizes++;
        }
        
        $scope.poSize = poSizes;
        console.log("poSize: " + $scope.poSize);
      });
  }
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
      SupplierSearch.searchSupplierId(code, "").then(function(SpIds){
        for (key in SpIds){
          if(SpIds.hasOwnProperty(key)){
            $scope.sp_id = SpIds[key];
            console.log("sp_id"+$scope.sp_id);
          }else{                        
            $scope.sp_id = null;
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
      SupplierSearch.searchSupplierId("", name).then(function(SpIds){
        for (key in SpIds){
          if(SpIds.hasOwnProperty(key)){
            $scope.sp_id = SpIds[key];
          }else{                        
            $scope.sp_id = null;
          }
        }
      });
      //console.log(SpNames);
    });
  }
  $scope.searchProductPriceCode = function(code) {
    name = $('input[name="product_name"]').val();
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
      SupplierSearch.searchProductId(document.getElementById('supplier_code').value, code, "").then(function(pdId){
        for (key in pdId){
          if(pdId.hasOwnProperty(key)){
            var value = pdId[key];
          $scope.pd_id = value;
          console.log($scope.pd_id);
          }
        }
      });
    });
  }

  $scope.searchProductPriceName = function(name) {
    code = $('input[name="product_code"]').val();
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
      SupplierSearch.searchProductPrice(document.getElementById('supplier_code').value, "", name).then(function(PdPrices){
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
      SupplierSearch.searchProductId(document.getElementById('supplier_code').value, "", name).then(function(pdId){
        for (key in pdId){
          if(pdId.hasOwnProperty(key)){
            var value = pdId[key];
          $scope.pd_id = value;
          console.log($scope.pd_id);
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
    // $scope.items.push({'ProductName': name, 'Cost': $scope.PdPrice, 'Qty': qty, 'Total':total});    
    $scope.items.push({'ProductName': name,'Cost': $scope.PdPrice, 'Qty': qty, 'Total':total});
    $scope.products.push({'pd_id':$scope.pd_id, 'quantity':qty, 'price':$scope.PdPrice});
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
  $scope.getpoSize();
  $scope.getPo = function (){
    

    var poNum = $scope.poSize;
    if(poNum < 10){
      $scope.poName = 'PO0000' + poNum;
    }else if(poNum < 100){
      $scope.poName = 'PO000'+ poNum;
    }else if(poNum < 1000){
      $scope.poName = 'PO00' + poNum;
    }else if(poNum < 10000){
      $scope.poName = 'PO0'+ poNum;
    }else{
      $scope.poName = 'PO' + poNum;
    }
    console.log("poName"+$scope.poName);
  }

  $scope.confirmPo = function(){
        $scope.getPo();
        if (confirm("Are you sure?\n System will automatically generate PO Report") == true){
          var orderDate = document.getElementById("datePicker").value;
          var expectedDate = document.getElementById("datePicker").value;
          var total = Number(document.getElementById("totalInput").value);
          console.log($scope.poName);
          SupplierSearch.createPO($scope.poName,$scope.sp_id,orderDate,orderDate,total, total*1.07, 'Open',  $scope.products);
          $scope.openPoReport;
        };
    };
  $scope.openPoReport = function(){
    $window.open('PO_Report.html')
  }
$scope.printIt = function(){
   var table = document.getElementById('printArea').innerHTML;
   var myWindow = $window.open('', '', 'width=800, height=600');
   myWindow.document.write(table);
   myWindow.print();
};

  $scope.createPO = function(){
      $scope.confirmPo();
  }
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

  // _________________________TRANSACTION______________________________
  $scope.transaction = [];
  $scope.currentTran = [];
  $scope.getTransaction = function () {    
    url = "http://54.179.174.140/api/movement/"+$scope.currentAI.pd_id._id;
    $http.get(url)
      .success(function (response) {
        $scope.transaction = response;
      });
  };

  $scope.searchByPeriod = function(){
    // alert("Test");
    url = "http://54.179.174.140/api/movement/search/period?transaction_type=";
    typeTran =  $('select[name="search_by_type"]').val();
    products_id = currentAI.pd_id._id;
    period = $('select[name="search_by_period"]').val();
    url = url + typeTran +"&pd_id="+ products_id +"&period="+ period;
    console.log(url);
    $http.get(url)
      .success(function (response) {
        $scope.transaction = response;
        // $scope.filteredPO = $scope.purchaseOrder.slice(0, 10);
        console.log(response);
      });
  }

  // $scope.getTransaction();

  // _________________________TRANSACTION______________________________

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

  $scope.searchProductCode = function() {
    
    $scope.currentProduct = null;

    angular.forEach($scope.products, function(value, key){

      var matchedProductCode = value.pd_id.pd_id == $scope.productSelectedCode

      console.log(value.pd_id.pd_id)

         if(matchedProductCode) {

            $scope.currentProduct = value;
            console.log('Found -> ' + $scope.currentProduct.pd_id.pd_id);

            if (angular.isUndefined($scope.productSelectedName) || $scope.productSelectedName != $scope.currentProduct.pd_id.pd_name) {
              $scope.productSelectedName = value.pd_id.pd_name;
            }
         }
      });
  }

  $scope.searchProductName = function() {
    
    $scope.currentProduct = null;

    angular.forEach($scope.products, function(value, key){

      var matchedProductName = value.pd_id.pd_name == $scope.productSelectedName

      console.log(value.pd_id.pd_name)

         if(matchedProductName) {

            $scope.currentProduct = value;
            console.log('Found -> ' + $scope.currentProduct.pd_id.pd_name);

            if (angular.isUndefined($scope.productSelectedCode) || $scope.productSelectedCode != $scope.currentProduct.pd_id.pd_name) {
              $scope.productSelectedCode = value.pd_id.pd_id;
            }
         }
      });
  }

  $scope.supplyProduct = function ($event) {
    
    $event.preventDefault()

    url = "http://54.179.174.140/api/inventory/" + $scope.currentProduct._id;

    $http.put(url, {
      pd_id       : $scope.currentProduct.pd_id._id,
      quantity    : $scope.currentProduct.quantity - $scope.qty_supply,
      zone_id     : $scope.currentProduct.zone_id._id,
      movement_id : "ms0002"
    })
      .success(function (response) {
        console.log('succeed');
        console.log(response);

        window.location.href = 'SCN_AI010.html'
      });
  }

  $scope.getProducts = function(){
    url = "http://54.179.174.140/api/inventory";
    console.log(url);
    $http.get(url)
      .success(function (response) {
        $scope.products = response;
      });
  };

  $scope.validateSupplyField = function(){

    var number = +$scope.qty_supply; // made cast obvious for demonstration

    var notEmptyString = $scope.qty_supply != ''
    var positiveNumber = number > 0
    var isNumber       = number.toString() !== $scope.qty_supply

    if (notEmptyString && (!positiveNumber || isNumber)) {

      alert('Please input positive number');
      $scope.qty_supply = ''

      return 
    }

    var remainingNumber = +($scope.currentProduct.quantity - $scope.qty_supply);
    if (remainingNumber < 0) {
      alert('Quantity is not enought');
    }
  }

  $scope.goToMainPage = function() {
    window.location.href = 'SCN_AI010.html';
  }

  $scope.getProducts();
 }

// SUPPLIERS CONTORLLER

function supplierController($scope, $http, updateSupplierWithFile, createNewSupplier){

  $scope.currentSupplier = null;
  $scope.options = [
    {
      name: 'Active',
      value: 'Active'
    }, 
    {
      name: 'Inactive',
      value: 'Inactive'
    }
  ];

  $scope.getSuppliers = function () {

    code = '?code='  + $scope.searchSupplierCode;
    name = '&name='  + $scope.searchSupplierName;
    stat = '&status=' + $scope.searchSupplierStatus;

    url = "http://54.179.174.140/api/supplier/search";
    url = url + code + name + stat;

    console.log('Getting suppliers from URL: ' + url);

    $http.get(url)
      .success(function (response) {
        $scope.suppliers = response;
        $scope.setCurrentNumberSupplier($scope.suppliers.length)
      });
  };
  

  $scope.setCurrentNumberSupplier = function (length) {
    // If the create supplier page does not appear yet
    // or createSupplier is undefined. Then, do not have to do that
    if (!angular.isUndefined($scope.createSupplier)) {
      $scope.createSupplier.code = 'SP000' + (length + 1);
    }
  }


  $scope.didClearButtonPress = function () {

    $scope.searchSupplierCode   = '';
    $scope.searchSupplierName   = '';
    $scope.searchSupplierStatus = '';

    $scope.getSuppliers();

    $scope.searchSupplierStatus = 'Active';
  }  

  $scope.setCurrentSupplier = function (index) {
    $scope.currentSupplier = $scope.suppliers[index];
  }

  $scope.hasCurrentSupplier = function () {
    return !(angular.isUndefined($scope.currentSupplier) || $scope.currentSupplier === null);
  }

  $scope.updateSupplier = function($event){   
    $event.preventDefault()

    var updateUrl = "http://54.179.174.140/api/supplier/" + $scope.currentSupplier._id;
    var file = $scope.myFile;
    var data = $scope.currentSupplier;

    console.log('Updating: ' + updateUrl);

    console.log('file is ' );
    console.dir(file);
  
    updateSupplierWithFile.uploadFileToUrl(file, data, updateUrl, $scope.goToMainPage);  
  }

  $scope.createNewSupplier = function () {

    if(!$scope.validateSupplierField()) {
      alert("Please input required input field")
      return
    }

    $scope.removeNull();

    var uploadUrl = "http://54.179.174.140/api/supplier";
    var file = $scope.myFile;
    var data = $scope.createSupplier;

    console.log('file is ' );
    console.dir(file);
    
    createNewSupplier.uploadFileToUrl(file, data, uploadUrl, $scope.goToMainPage());
  }

  $scope.goToMainPage = function() {
    window.location.href = 'SCN_SP010.html';
  }

  $scope.validateSupplierField = function () {

    var required = $scope.createSupplier.code != null && 
                   $scope.createSupplier.name != null && 
                   $scope.createSupplier.delivery_day != null && 
                   $scope.createSupplier.phone != null

    return required
  }

  $scope.removeNull = function (data) {

    // createSupplier.code
    if (angular.isUndefined($scope.createSupplier.code) || $scope.createSupplier.code == null) {
      $scope.createSupplier.code = ' '
      console.log('code:' + $scope.createSupplier.code);
    }

    // createSupplier.name
    if (angular.isUndefined($scope.createSupplier.name) || $scope.createSupplier.name == null) {
      $scope.createSupplier.name = ' '
      console.log('name:' + $scope.createSupplier.name);
    }

    // createSupplier.delivery_day
    if (angular.isUndefined($scope.createSupplier.delivery_day) || $scope.createSupplier.delivery_day == null) {
      $scope.createSupplier.delivery_day = ' '
      console.log('delivery_day:' + $scope.createSupplier.delivery_day);
    }

    // createSupplier.address
    if (angular.isUndefined($scope.createSupplier.address) || $scope.createSupplier.address == null) {
      $scope.createSupplier.address = ' '
      console.log('address:' + $scope.createSupplier.address);
    }

    // createSupplier.website
    if (angular.isUndefined($scope.createSupplier.website) || $scope.createSupplier.website == null) {
      $scope.createSupplier.website = ' '
      console.log('website:' + $scope.createSupplier.website);
    }

    // createSupplier.sale_person_name
    if (angular.isUndefined($scope.createSupplier.sale_person_name) || $scope.createSupplier.sale_person_name == null) {
      $scope.createSupplier.sale_person_name = ' '
      console.log('sale_person_name:' + $scope.createSupplier.sale_person_name);
    }

    // createSupplier.sale_person_email
    if (angular.isUndefined($scope.createSupplier.sale_person_email) || $scope.createSupplier.sale_person_email == null) {
      $scope.createSupplier.sale_person_email = ' '
      console.log('sale_person_email:' + $scope.createSupplier.sale_person_email);
    }

    // createSupplier.status
    if (angular.isUndefined($scope.createSupplier.status) || $scope.createSupplier.status == null) {
      $scope.createSupplier.status = ' '
      console.log('status:' + $scope.createSupplier.status);
    }
  }



  // Check changing on input field
  $("#imgInput").change(function(){
    readURL(this);
  });

  // Get all suppliers at first visit
  $scope.didClearButtonPress();
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
        $('#blah').attr('src', e.target.result);
    }
    
    reader.readAsDataURL(input.files[0]);
  }
}

app.service('updateSupplierWithFile', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, data, uploadUrl, callBack){

        var fd = new FormData();
        fd.append('sp_id', 'SP' + data.name);
        fd.append('code', data.code);
        fd.append('name', data.name);
        fd.append('address', data.address);
        fd.append('website', data.website);
        fd.append('phone', data.phone);
        fd.append('fax', data.fax);
        fd.append("delivery_day", data.delivery_day);
        fd.append('sale_person_name', data.sale_person_name);
        fd.append('sale_person_mobile', data.sale_person_mobile);
        fd.append('sale_person_email',  data.sale_person_email);
        fd.append('status', data.status);

        if (!angular.isUndefined(file)) {
          fd.append('logo', file);  
        }
        
        $http.put(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(response) {
            
            var delay=1000; // 1 seconds
            setTimeout(function(){
              //your code to be executed after 1 seconds
              console.log('Success with response: ' + response);
              callBack();
            }, delay); 

        })
        .error(function(response) {
          console.log(response);
        });
    }
}]);

app.service('createNewSupplier', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, data, uploadUrl, callBack){
      
      console.log(file.name);

        var fd = new FormData();
        fd.append('sp_id', data.code);
        fd.append('code', data.code);
        fd.append('name', data.name);
        fd.append('address', data.address);
        fd.append('website', data.website);
        fd.append('phone', data.phone);
        fd.append('fax', data.fax);
        fd.append("delivery_day", data.delivery_day);
        fd.append('sale_person_name', data.sale_person_name);
        fd.append('sale_person_mobile', data.sale_person_mobile);
        fd.append('sale_person_email',  data.sale_person_email);
        fd.append('status', data.status);
        fd.append('logo', file);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(response) {
            
            var delay=1000; // 1 seconds
            setTimeout(function(){
              //your code to be executed after 1 seconds
              console.log('Success with response: ' + response);
              callBack();
            }, delay); 
            
        })
        .error(function(response) {
          console.log(response);
        });
    }
}]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);