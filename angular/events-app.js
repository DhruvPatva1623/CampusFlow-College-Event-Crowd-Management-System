// events-app.js - AngularJS part (used only on events.html)
// uses eventsData and the functions from js/events.js

var app = angular.module("campusApp", []);

app.controller("EventsController", function ($scope) {

  // list shown with ng-repeat
  // later this can come from php/get_events.php using $http
  $scope.events = eventsData;

  // linked with the search box and the category buttons
  $scope.searchText = "";
  $scope.selectedCategory = "All";
  $scope.categories = ["All", "Technical", "Cultural", "Sports", "Workshop"];

  $scope.setCategory = function (category) {
    $scope.selectedCategory = category;
  };

  // keeps only the events of the selected category
  $scope.categoryFilter = function (event) {
    return $scope.selectedCategory === "All" || event.category === $scope.selectedCategory;
  };

  // so that we can use these inside the html
  $scope.percent = getPercentage;
  $scope.status = getStatus;
  $scope.statusClass = getStatusClass;
});
