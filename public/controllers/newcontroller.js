var mySystemApp = angular.module('mySystemApp', []);
mySystemApp.controller('AppCtrl', ['$scope', '$http', '$timeout', function($scope, $http) {
  console.log("Hello World from controller");

  var refresh = function(){
    $http.get('/subsystem').success(function(response){
      console.log("I got the data I requested");
      $scope.harvesters = response;
      $scope.mdata = "";

    });

  };

  refresh();

     $http({
    method : "GET",
    url : "http://localhost:3000/subsystem/mc1"
  }).then(function mySucces(response) {
    $scope.myMcone = response.data;
  }, function myError(response) {
    $scope.myMcone = response.data.records;
  });

  $http({
    method : "GET",
    url : "http://localhost:3000/subsystem/mc2"
  }).then(function mySucces(response) {
    $scope.myMctwo = response.data;
  }, function myError(response) {
    $scope.myMctwo = response.data.records;
  });

  $http({
    method : "GET",
    url : "http://localhost:3000/subsystem/cc"
  }).then(function mySucces(response) {
    $scope.myCc = response.data;
  }, function myError(response) {
    $scope.myCc = response.data.records;
  });


}]); 

