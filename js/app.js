function mainController($scope) {
  $scope.message = "Hello AngularJS";
  $scope.name = '';
};

angular.module('myApp', [])
  .controller('MainController', mainController);