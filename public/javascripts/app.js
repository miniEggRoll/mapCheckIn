var app = angular.module('mapApp', ['mapController', 'ngRoute', 'editRestaurantCtrl']);

app.config(function($routeProvider){
	$routeProvider
		.when('/Map', {
			templateUrl: "templates/map.html",
			controller: "mapCtrl"
		})
		.when('/Edit', {
			templateUrl: "templates/editRestaurant.html",
			controller: "editRestaurantCtrl"
		})
		.otherwise({
			redirectTo: "/Map"
		})
});