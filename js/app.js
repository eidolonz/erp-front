var app = angular.module('myApp', ['ui.bootstrap']);

app.controller('PoController', controllerGetPO);
app.controller('InController', controllerIncoming);
app.controller('SupplierController', supplierController);
app.controller('InventoryController', controllerGetAI);
app.controller('ZoneController', zoneController);
app.controller('priceController',controllerPrice);
app.controller('supplyProduct', supplyProduct);
app.controller('ProductController', productController);

//________________________ IN __________________________________
function controllerIncoming($scope, $http, $location, $window){
  //setting Pagination Properties
  $scope.filteredPO = [];
  $scope.currentPage = 1;
  $scope.numPerPage = 10;
  $scope.maxSize = 5;
  //setting Ordering
  $scope.orderByField = 'po_id';
  $scope.reverseSort = 'false';
  //var in IN020
  $scope.purchaseOrder = [];
  $scope.poDetail;
  $scope.sp_name;
  $scope.po_id;
  $scope.delivery_date;
  $scope.currentPoNumber;
  $scope.poItem=[];

  // get PO from DB
  $scope.getpo = function(){
    url = "http://54.179.174.140/api/po_header/search";
    po_id = $('input[name="po_id"]').val();
    expected_date = $('input[name="expected_date"]').val();
    sp_name = $('input[name="sp_name"]').val();
    po_status = $('select[name="po_status"]').val();
    url = url + "?po_id=" + po_id + "&expected_date=" + expected_date + "&sp_name=" + sp_name + "&po_status=" + po_status;
    $http.get(url)
      .success(function (response) {
        $scope.purchaseOrder = response;
        $scope.filteredPO = $scope.purchaseOrder.slice(0, $scope.numPerPage);
      });
  };
  $scope.getpo();
  $scope.getPoId = function(){
    url = "http://54.179.174.140/api/po_header/search?po_id=" + $scope.po_id;
    $http.get(url)
      .success(function (response) {
        $scope.poDetail = response[0];
        console.log(response);
        $scope.getPoItem();
      });
  };
  $scope.getPoNumber = function(){
    $scope.po_id = $location.search().po_num;
    $scope.getPoId();
  }
  $scope.getPoNumber();

  $scope.getPoItem = function(){
    url = "http://54.179.174.140/api/po_transaction";
    var count;
    $http.get(url)
      .success(function (response){
        for (count in response){
          if(response[count].po_id.po_id == $scope.po_id){
            console.log(response[count].po_id.po_id);
            $scope.poItem.push(response[count]);
          }
        }
        console.log($scope.poItem);
      });
  }  
  $scope.updatePo = function(invoice_no){

    // $event.preventDefault()
    console.log('update po_header');
    console.log('invoice_no: ' + invoice_no);
    
    url = "http://54.179.174.140/api/po_header/close/" + $scope.poDetail._id;
    $http.put(url, {
        'invoice_no': invoice_no
    })
      .success(function (response){
        console.log('succeed');
        console.log(response);
        if(response == 'Success'){
          alert(response);
          $window.location.href = 'SCN_IN010.html#/';
        }else{
          alert(response);
        }
      })
      .error(function (response){
        console.log('error');
        console.log(response);
      });
  }
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
        _codes[codes[i].code] = codes[i].name;
        
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
        _names[names[i].name] = names[i].code;
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
  this.searchSupplierDeliverDate = function(code, name){
    var deferred = $q.defer();
    $http.get(API_URL+code+'&name='+name).then(function(delivers){
      var _delivers = {};
      var delivers = delivers.data;
      console.log(delivers);
      for(var i = 0, len = delivers.length; i < len; i++) {
        // _names[names[i].name] = '['+names[i].code+'] ' + names[i].name;
        _delivers[delivers[i].delivery_day] = delivers[i].delivery_day;
      }
      deferred.resolve(_delivers);
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
        _codes[code] = codes[i].pd_id.pd_id;
        
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
  this.createPO = function(po_id, sp_id, order_date, expected_date,untaxed_total, total,po_status, invoice_no,transLists){
    // $event.preventDefault()
    console.log('create po_htransaction');
    console.log('po_id: ' + po_id);
    console.log('sp_id: ' + sp_id);
    console.log('order: ' + order_date);
    console.log('expected_date: ' + expected_date);
    console.log('untaxed_total: ' + untaxed_total);
    console.log('total: ' + total);
    console.log('po_status: ' + po_status );
    console.log('invoice_no: ' + invoice_no);
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
        'invoice_no': invoice_no,
        'transactions': transLists
    })
      .success(function (response){
        console.log('succeed');
        console.log(response);
        if(response == 'Created'){
          $window.location.href = 'PO_Report.html#/?po_num='+po_id.toUpperCase();
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
app.controller('SearchSupplier',function($scope, $timeout, SupplierSearch, $window, $http, $location){
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
  $scope.isSpDisable = false;
  $scope.sp_deliverDate=0;

  $scope.supplier;

  //for PO Report
  $scope.currentPoNumber;
  $scope.currentPoDate;
  $scope.poItem = [];
  $scope.poheader = null;


  $scope.getPoNumber = function(){
    $scope.currentPoNumber = $location.search().po_num;
    $scope.getPoheader();
  }
  
  $scope.getPoheader = function(){    
    url = "http://54.179.174.140/api/po_header/search?po_id=" + $scope.currentPoNumber;
    $http.get(url)
      .success(function (response){
        $scope.poheader = response[0];
        $scope.getPoItem();
      });
  } 
  $scope.getPoItem = function(){
    url = "http://54.179.174.140/api/po_transaction";
    var count;
    $http.get(url)
      .success(function (response){
        for (count in response){
          if(response[count].po_id.po_id == $scope.currentPoNumber){
            console.log(response[count].po_id.po_id);
            $scope.poItem.push(response[count]);
          }
        }
        console.log($scope.poItem);
      });
  }  
  $scope.getPoNumber();
  
  $scope.getpoSize = function(){
    url = "http://54.179.174.140/api/po_header";
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
    SupplierSearch.searchSupplierCode(code, "").then(function(SpCodes){
      $scope.SpCodes = SpCodes;
      console.log('SpCodes');
      console.log(SpCodes);
      document.getElementById('supplier_name').value = "";
      SupplierSearch.searchSupplierName(code, "").then(function(SpNames){
        for (key in SpNames){
          if(SpNames.hasOwnProperty(key)){
            var value = key;
            document.getElementById('supplier_name').value = value;
          }else{            
            document.getElementById('supplier_name').value = "";
          }
        }
      });
      SupplierSearch.searchSupplierDeliverDate(code,"").then(function(SpDelivers){
        for (key in SpDelivers){
          if(SpDelivers.hasOwnProperty(key)){
            $scope.sp_deliverDate = SpDelivers[key];
          }else{
            $scope.sp_deliverDate = null;
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
            var value = key;
            document.getElementById('supplier_code').value = value;
          }else{            
            document.getElementById('supplier_code').value = "";
          }
        }
      });
      SupplierSearch.searchSupplierDeliverDate("",name).then(function(SpDelivers){
        for (key in SpDelivers){
          if(SpDelivers.hasOwnProperty(key)){
            $scope.sp_deliverDate = SpDelivers[key];
          }else{
            $scope.sp_deliverDate = null;
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
    names = $('input[name="product_name_create"]').val();
    SupplierSearch.searchProductPriceCode(document.getElementById('supplier_code').value, code, "").then(function(PdCodes){
      $scope.PdCodes = PdCodes;
      document.getElementById('product_name_create').value = "";
      SupplierSearch.searchProductPriceName(document.getElementById('supplier_code').value, code, "").then(function(PdNames){
        for (key in PdNames){
          if(PdNames.hasOwnProperty(key)){
            var value = PdNames[key];
            document.getElementById('product_name_create').value = value;
          }else{            
            document.getElementById('product_name_create').value = "";
          }
        }
      });
      document.getElementById('product_price_create').value = "";
      SupplierSearch.searchProductPrice(document.getElementById('supplier_code').value, code, "").then(function(PdPrices){
        for (key in PdPrices){
          if(PdPrices.hasOwnProperty(key)){
            var value = PdPrices[key];
          $scope.PdPrice = value;
            document.getElementById('product_price_create').value = value;
          }else{            
            document.getElementById('product_price_create').value = "";
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
  codes = $('input[name="product_code_create"]').val();
  SupplierSearch.searchProductPriceName(document.getElementById('supplier_code').value,"", name).then(function(PdNames){
      $scope.PdNames = PdNames;
      document.getElementById('product_code_create').value = "";
      SupplierSearch.searchProductPriceCode(document.getElementById('supplier_code').value,"", name).then(function(PdCodes){
        for (key in PdCodes){
          if(PdCodes.hasOwnProperty(key)){
            var value = PdCodes[key];
            document.getElementById('product_code_create').value = value;
          }else{            
            document.getElementById('product_code_create').value = "";
          }
        }
      });
      document.getElementById('product_price_create').value = "";
      SupplierSearch.searchProductPrice(document.getElementById('supplier_code').value, "", name).then(function(PdPrices){
        for (key in PdPrices){
          if(PdPrices.hasOwnProperty(key)){
            var value = PdPrices[key];
          $scope.PdPrice = value;
            document.getElementById('product_price_create').value = value;
          }else{            
            document.getElementById('product_price_create').value = "";
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
    var qty = document.getElementById('product_qty_create').value;
    document.getElementById('product_price_create').value = $scope.PdPrice * qty;
  }
  $scope.addProductPriceEdit = function(){
    var qty = document.getElementById('product_qty_edit').value;
    document.getElementById('product_price_edit').value = $scope.PdPrice * qty;
  }

  $scope.getTotal = function(){
    var total = 0;
    for(var i = 0; i < $scope.items.length; i++){
        var product = $scope.items[i];
        total += Number(product.Total);
    }
    return total;
  }

  $scope.addRow = function(){
    var id = document.getElementById('product_code_create').value;
    var name = document.getElementById('product_name_create').value;
    var qty = document.getElementById('product_qty_create').value;
    var total = Number(document.getElementById('product_price_create').value);
    // $scope.items.push({'ProductName': name, 'Cost': $scope.PdPrice, 'Qty': qty, 'Total':total});    
    $scope.items.push({'ProductCode':id,'ProductName': name,'Cost': $scope.PdPrice, 'Qty': qty, 'Total':total});
    $scope.products.push({'pd_id':$scope.pd_id, 'quantity':qty, 'price':$scope.PdPrice});
    $scope.product_name = '';
    $scope.PdPrice = 0;
    $scope.product_qty = 1;
    $scope.product_price = 0;
    $scope.isSpDisable = true;
  document.getElementById("productPriceSearchForm").reset();
  }

  $scope.delRow = function(index){
    $scope.items.splice(index,1);
  }
  $scope.editRow = function(index){
    $scope.currentIndex = index;
    document.getElementById('product_code_edit').value = $scope.items[index].ProductCode;
    document.getElementById('product_name_edit').value = $scope.items[index].ProductName;
    document.getElementById('product_qty_edit').value = $scope.items[index].Qty;    
    document.getElementById('product_price_edit').value = $scope.items[index].Total;
    $scope.PdPrice = $scope.items[$scope.currentIndex].Cost;
  }
  $scope.addEditRow = function(){
    $scope.items[$scope.currentIndex].ProductCode = document.getElementById('product_code_edit').value;
    $scope.items[$scope.currentIndex].ProductName = document.getElementById('product_name_edit').value;
    $scope.items[$scope.currentIndex].Qty = document.getElementById('product_qty_edit').value;
    $scope.items[$scope.currentIndex].Total = document.getElementById('product_price_edit').value;
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
          var orderedDate = new Date(orderDate);
          var expectDate = orderedDate;
          expectDate.setDate(expectDate.getDate()+$scope.sp_deliverDate);
          console.log('ex: '+ expectDate);
          var expectedDate = expectDate.getFullYear()+'-'+("0"+(expectDate.getMonth()+1)).slice(-2)+'-'+("0" + expectDate.getDate()).slice(-2);
          console.log('expectDate: '+expectedDate);

          var total = Number(document.getElementById("totalInput").value);
          console.log($scope.poName);
          SupplierSearch.createPO($scope.poName,$scope.sp_id,orderDate,expectedDate,total, total*1.07, 'Open', 0,  $scope.products);
          //$scope.openPoReport;
        };
    };
  $scope.openPoReport = function(){
    $window.open('PO_Report.html')
  }
  $scope.printDiv = function() {
    var printContents = document.getElementById('report').innerHTML;
    console.log(printContents);
    var popupWin = window.open('', '_blank', 'width=1300,height=700');
    popupWin.document.open()
    popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
    // popupWin.document.write('<html><head><link rel="stylesheet" href="css/bootstrap.min.css"/><link rel="stylesheet" href="css/bootstrap-theme.min.css"/><link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css"/><link rel="stylesheet" href="css/datepicker.css"/><link rel="stylesheet" href="css/style.css"/><script data-require="angular.js@1.4.8" data-semver="1.4.8" src="http://code.angularjs.org/1.4.8/angular.min.js"></script><script data-require="angular-ui-bootstrap@0.3.0" data-semver="0.3.0" src="http://angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.3.0.min.js"></script><script src="js/jquery-1.11.3.min.js"></script><script src="js/bootstrap-datepicker.js"></script><script src="js/bootstrap.min.js"></script><script src="bower_components/angular/angular.min.js"></script><script src="js/app.js"></script></head><body style="padding:50px;" onload="window.print()">' + printContents + '</html>');
    popupWin.document.close();
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


  $scope.searchTran = function(){
    period = $('select[name="search_by_period"]').val();
    date_from = $('input[name="date_from"]').val();
    date_to = $('input[name="date_to"]').val();
    console.log("period : "+period+"date_from : "+date_from+"date_to : "+date_to);
    if(period != ""){
      $scope.searchByPeriod();
    }else if(date_from != "" && date_to != ""){
      // alert("date "+date_from+"|date_to "+date_to);
      $scope.searchByDate();
    }else{
      alert("Null");
    }
  }


  $scope.searchByPeriod = function(){
    url = "http://54.179.174.140/api/movement/search/period?transaction_type=";
    typeTran =  $('select[name="search_by_type"]').val();
    products_id = currentAI.pd_id._id;
    period = $('select[name="search_by_period"]').val();
    url = url + typeTran +"&pd_id="+ products_id +"&period="+ period;
    // console.log("period value : "+period);
    console.log(url);
    $http.get(url)
      .success(function (response) {
        $scope.transaction = response;
        // $scope.filteredPO = $scope.purchaseOrder.slice(0, 10);
        console.log(response);
      });
  }

  $scope.searchByDate = function(){
    url = "http://54.179.174.140/api/movement/search/date?transaction_type=";
    typeTran =  $('select[name="search_by_type"]').val();
    products_id = currentAI.pd_id._id;
    date_from = $('input[name="date_from"]').val();
    date_to = $('input[name="date_to"]').val();
    url = url + typeTran +"&pd_id="+ products_id +"&date_from="+ date_from+"&date_to="+date_to;
    console.log("searchByDate : "+url);
    $http.get(url)
      .success(function (response) {
        $scope.transaction = response;
        // $scope.filteredPO = $scope.purchaseOrder.slice(0, 10);
        // console.log("searchByDate : "+response);
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
        $scope.createZone.zone_id = 'ZN' + ($scope.zones.length + 1)
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
    $scope.searchZoneType = '';
    $scope.searchZoneName = '';

    $scope.getZones();

    $scope.searchZoneType = $scope.options[0].value;
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
      $scope.qty_supply = ''
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
      name: 'Available',
      value: 'Available'
    }, 
    {
      name: 'Obsolete',
      value: 'Obsolete'
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

    $scope.searchSupplierStatus = 'Available';
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
  
    if (!angular.isUndefined(file) && file.size>100000) {
      alert("Too large file size");
      return
    }
  
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

    if (!angular.isUndefined(file) && file.size>100000) {
      alert("Too large file size");
      return
    }
    
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
        fd.append('sp_id', data.code);
        fd.append('code', data.code);
        fd.append('name', data.name);
        fd.append('address', data.address);
        fd.append('website', data.website);
        fd.append('phone', data.phone);
        fd.append('fax', data.fax);
        fd.append('delivery_day', data.delivery_day);
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

        if (!angular.isUndefined(file)) {
          fd.append('logo', file);  
        }

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

// _____________________________PRICE__________________________

function controllerPrice($scope, $http){
  $scope.price_list = [];
  $scope.currentPrice = null;
  $scope.dateTemp = "";
  $scope.date = {
         value: new Date('2012-1-1')
       };
  $scope.year = "";
  $scope.month = "";
  $scope.day = "";
  $scope.reverseSort = 'false';
  $scope.price = 0;

  // setting variable of Pagination
  $scope.filteredPR = [];
  $scope.currentPage = 1;
  $scope.numPerPage = 10;
  $scope.maxSize = 5;

  $scope.getPriceList = function(){
    url = "http://54.179.174.140/api/price";
    $http.get(url)
      .success(function (response) {
        $scope.filteredPR = $scope.price_list.slice(0, 10);
        $scope.filteredPR = response;
        
        // $scope.filteredPO = $scope.purchaseOrder.slice(0, 10);
        console.log(response);
      });
  };

  $scope.hasCurrentPrice = function(){
    
    currentPrice = $scope.currentPrice;
    condition   = !(angular.isUndefined(currentPrice) || currentPrice === null)
    
    if (condition) {

      $scope.current_pd_type = currentPrice.pd_id.pd_type;
      $scope.current_pd_id = currentPrice.pd_id.pd_id;


      return condition
    }
    else {
      return condition
    }
  }

  $scope.setCurrentPrice = function(price){
    $scope.list_price = [];
    $scope.currentPrice = price;
    $scope.dateTemp = $scope.currentPrice.effective_date;
    console.log("dateTemp : "+$scope.dateTemp);
    console.log($scope.currentPrice.effective_date);
    $scope.dateDay = $scope.dateTemp.slice();

    $scope.year = $scope.dateDay[0]+$scope.dateDay[1]+$scope.dateDay[2]+$scope.dateDay[3];
    $scope.month = $scope.dateDay[5]+$scope.dateDay[6];
    $scope.day = $scope.dateDay[8]+$scope.dateDay[9];

    $scope.date = {
         value: new Date($scope.year+"-"+$scope.month+"-"+$scope.day)
       };
    console.log("datetime : "+$scope.date.value);

    
  }

  $scope.setCreate = function(){
    $scope.date = {
         value: new Date($scope.year+"-"+$scope.month+"-"+$scope.day)
       };
    console.log("datetime : "+$scope.date.value);

  }


  $scope.createPrice = function($event){

    $event.preventDefault()

    url = "http://54.179.174.140/api/price/";

    $http.post(url, {
      sp_id: $scope.currentPrice.sp_id._id,
      pd_price: $scope.currentPrice.pd_price,
      minimun_order: $scope.currentPrice.minimun_order,
      effective_date: $scope.date.value,
      pd_id: $scope.currentPrice.pd_id._id

    })
      .success(function (response) {
        $scope.goToMainPage();
      });
  }


  $scope.updatePrice = function($event){

    $event.preventDefault();

    url = "http://54.179.174.140/api/price/" + $scope.currentPrice._id;

    $http.put(url, {
      sp_id: $scope.currentPrice.sp_id._id,
      pd_price: $scope.currentPrice.pd_price,
      minimun_order: $scope.currentPrice.minimun_order,
      effective_date: $scope.date.value,
      pd_id: $scope.currentPrice.pd_id._id

    })
      .success(function (response) {
        $scope.goToMainPage();

      });
  }

  $scope.getProducts = function(){
    url = "http://54.179.174.140/api/product";

    $http.get(url)
        .success(function (response) {
        $scope.product_list = response;

      });
  }

  $scope.getSuppliers = function(){
    url = "http://54.179.174.140/api/supplier";

    $http.get(url)
        .success(function (response) {
        $scope.supplier_list = response;

      });

  }

  $scope.goToMainPage = function() {
    window.location.href = 'SCN_PR010.html'
  }


  $scope.searchPrice = function(){
    sp_code = $('select[name="sp_code"]').val();
    sp_name = $('select[name="sp_name"]').val();
    pd_code = $('select[name="pd_code"]').val();
    pd_name = $('select[name="pd_name"]').val();
    gte = $('input[name="price_min"]').val();
    lte = $('input[name="price_max"]').val();
    date_start = $('input[name="date_from"]').val();
    date_stop = $('input[name="date_to"]').val();
    // console.log(sp_code+" "sp_name+" "+pd_code+" "+pd_name+" "+gte+" "+lte+" "+date_start+" "+date_stop);
    url = "http://54.179.174.140/api/price/search?gte="+gte+"&lte="+lte+"&sp_code="+sp_code+"&sp_name="+sp_name+"&pd_code="+pd_code+"&pd_name="+pd_name+"&date_start="+date_start+"&date_stop="+date_stop;
    console.log(url);

    $http.get(url)
      .success(function (response) {
        $scope.filteredPR = response;
        console.log(response);
      });

  }


  // setting number of Pagination
 
  $scope.numPages = function () {
    console.log($scope.price_list);
    return Math.ceil($scope.price_list.length / $scope.numPerPage);
  };
  $scope.$watch('currentPage + numPerPage', function() {
    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
    , end = begin + $scope.numPerPage;
    
  $scope.filteredPR = $scope.price_list.slice(begin, end);
  });




  $scope.getProducts();
  $scope.getSuppliers();
  $scope.getPriceList();

}

// PRODUCT CONTROLLER
function productController($scope, $http, createNewProduct, updateProduct) {

  $scope.createProduct = {};
  $scope.searchProduct = {};

  $scope.currentProduct = null;

  $scope.options = [
    {
      name: 'Available',
      value: 'Available'
    }, 
    {
      name: 'Obsolete',
      value: 'Obsolete'
    }
  ];
  $scope.productTypes = [
    {
      name: 'Type1',
      value: 'Type1'
    }, 
    {
      name: 'Type2',
      value: 'Type2'
    }, 
    {
      name: 'Type3',
      value: 'Type3'
    }, 
    {
      name: 'Type4',
      value: 'Type4'
    }, 
    {
      name: 'Type5',
      value: 'Type5'
    }
  ];

  $scope.didClearButtonPress = function(){

    $scope.searchProduct.pd_code   = '';
    $scope.searchProduct.pd_name   = '';
    $scope.searchProduct.pd_status = '';

    $scope.getProducts();

    $scope.searchProduct.pd_status = 'Available';
  }

  $scope.getProducts = function(){

    pd_id     = "?pd_id="     + $scope.searchProduct.pd_code
    pd_name   = "&pd_name="   + $scope.searchProduct.pd_name
    pd_status = "&pd_status=" + $scope.searchProduct.pd_status

    url = "http://54.179.174.140/api/product/search" + pd_id + pd_status + pd_name;

    console.log(url);

    $http.get(url)
      .success(function (response) {
        $scope.products = response;
        $scope.createProduct.pd_code = 'PD000' + (response.length + 1);

        if($scope.hasErrorMessage(response)) {
          $scope.didClearButtonPress();
          return
        }

        console.log(response);
      });
  }

  $scope.hasErrorMessage = function(response){
    if(response.length == 1){
      if(!angular.isUndefined(response[0]).ErrorMessage){
        alert(response[0].ErrorMessage);
        return true
      }
    }

    return false;
  }
  $scope.createNewProduct = function () {

    var uploadUrl = "http://54.179.174.140/api/product";
    var data = $scope.createProduct;

    if(!$scope.validateProductField()) {
      alert("Please input required input field");
      return
    }

    if (!angular.isUndefined(data.pd_img) && data.pd_img.size>100000) {
      alert("Too large file size");
      return
    }

    console.log('file is ' );
    console.dir(data.pd_img);
    
    createNewProduct.uploadFileToUrl(data, uploadUrl, $scope.goToMainPage());
  }

  $scope.updateProduct = function () {

    var uploadUrl = "http://54.179.174.140/api/product/" + $scope.currentProduct._id;
    var data = $scope.currentProduct;

    var required = angular.isUndefined($scope.currentProduct.pd_name) || 
                   $scope.currentProduct.pd_name == null || 
                   $scope.currentProduct.pd_name == '';

    if(required) {
      alert("Please input required field");
      return
    }

    if (!angular.isUndefined(data.pd_img) && data.pd_img.size>100000) {
      alert("Too large file size");
      return
    }

    console.log('update product with url : ' + uploadUrl);
    console.log('file is ' );
    console.dir(data.pd_img);
    
    updateProduct.uploadFileToUrl(data, uploadUrl);
  }

  $scope.setCurrentProduct = function (index) {
    $scope.currentProduct = $scope.products[index];
  }

  $scope.hasCurrentProduct = function () {
    condition = !(angular.isUndefined($scope.currentProduct) || $scope.currentProduct === null)
    return condition;
  }

  $scope.validateProductField = function () {
    var required = $scope.createProduct.pd_code   != null && 
                   $scope.createProduct.pd_name   != null && 
                   $scope.createProduct.pd_type   != null && 
                   $scope.createProduct.pd_status != null

    return required
  }

  $scope.goToMainPage = function() {
    window.location.href = 'SCN_PD010.html';
  }
  
  // Check changing on input field
  $("#imgInput").change(function(){
    readURL(this);
  });

  // Get all products at first visit
  $scope.didClearButtonPress();
}

app.service('createNewProduct', ['$http', function ($http) {
    this.uploadFileToUrl = function(data, uploadUrl, callBack){

        var fd = new FormData();
        fd.append('pd_id', data.pd_code);
        fd.append('pd_name', data.pd_name);
        fd.append('pd_type', data.pd_type);
        fd.append('pd_status', data.pd_status);

        if (!angular.isUndefined(data.pd_img)) {
          fd.append('image', data.pd_img);  
        }

        console.log(fd);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(response) {
            
            var delay = 3000; // 1 seconds
            setTimeout(function(){
              //your code to be executed after 1 seconds
              console.log('Success with response: ' + response);
              window.location.href = 'SCN_PD010.html';
            }, delay); 
            
        })
        .error(function(response) {
          console.log('Error with response ' + response);
        });
    }
}]);

app.service('updateProduct', ['$http', function ($http) {
    this.uploadFileToUrl = function(data, uploadUrl){
        
        console.log(data);

        var fd = new FormData();
        fd.append('pd_id', data.pd_id);
        fd.append('pd_name', data.pd_name);
        fd.append('pd_type', data.pd_type);
        fd.append('pd_status', data.pd_status);
        fd.append('image', data.image);

        if (!angular.isUndefined(data.pd_img)) {
          fd.append('pd_img', data.pd_img);  
        }

        $http.put(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(response) {
            
              //your code to be executed after 1 seconds
              console.log('Success with response: ' + response);
              window.location.href = 'SCN_PD010.html';
            
        })
        .error(function(response) {
          console.log('Error with response ' + response);
        });
    }
}]);


// _____________________________PRICE__________________________END