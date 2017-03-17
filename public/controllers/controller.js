var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', '$timeout', function($scope, $http) {
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
    url : "http://localhost:3000/flowtags/ft1/"
  }).then(function mySucces(response) {
    $scope.myFlowtagone = response.data;
  }, function myError(response) {
    $scope.myFlowtagone = response.data.records;
  });

	  
   $http({
    method : "GET",
    url : "http://localhost:3000/flowtags/ft2/"
  }).then(function mySucces(response) {
    $scope.myFlowtagtwo = response.data;
  }, function myError(response) {
    $scope.myFlowtagtwo = response.data.records;
  });

  $http({
    method : "GET",
    url : "http://localhost:3000/flowtags/ft3/"
  }).then(function mySucces(response) {
    $scope.myFlowtagthree = response.data;
  }, function myError(response) {
    $scope.myFlowtagthree = response.data.records;
  });

    $http({
    method : "GET",
    url : "http://localhost:3000/flowtags/ft4/"
  }).then(function mySucces(response) {
    $scope.myFlowtagfour = response.data;
  }, function myError(response) {
    $scope.myFlowtagfour = response.data.records;
  });

      $http({
    method : "GET",
    url : "http://localhost:3000/flowtags/ft5/"
  }).then(function mySucces(response) {
    $scope.myFlowtagfive = response.data;
  }, function myError(response) {
    $scope.myFlowtagfive = response.data.records;
  });

      $http({
    method : "GET",
    url : "http://localhost:3000/flowtags/ft6/"
  }).then(function mySucces(response) {
    $scope.myFlowtagsix = response.data;
  }, function myError(response) {
    $scope.myFlowtagsix = response.data.records;
  });

      $http({
    method : "GET",
    url : "http://localhost:3000/flowtags/ft7/"
  }).then(function mySucces(response) {
    $scope.myFlowtagseven = response.data;
  }, function myError(response) {
    $scope.myFlowtagseven = response.data.records;
  });

      $http({
    method : "GET",
    url : "http://localhost:3000/flowtags/ft8/"
  }).then(function mySucces(response) {
    $scope.myFlowtageight = response.data;
  }, function myError(response) {
    $scope.myFlowtageight = response.data.records;
  });

      $http({
    method : "GET",
    url : "http://localhost:3000/flowtags/ft9/"
  }).then(function mySucces(response) {
    $scope.myFlowtagnine = response.data;
  }, function myError(response) {
    $scope.myFlowtagnine = response.data.records;
  });

      $http({
    method : "GET",
    url : "http://localhost:3000/flowtags/ft10/"
  }).then(function mySucces(response) {
    $scope.myFlowtagten = response.data;
  }, function myError(response) {
    $scope.myFlowtagten = response.data.records;
  });

}]); 

