'use strict'

angular.module('mapController', ['repository'])
    .controller('mapCtrl', function($scope, restaurant, mapApi){
		$scope.map = {};
		$scope.markerAndInfo = [];
		$scope.init = function(){
			mapApi.InitMap(function(map, marker){
				$scope.map = map;
				$scope.markerAndInfo = marker;
			});
		};
    })
    .factory('setting', function(){
    	return {
    		iconPath: "http://fc09.deviantart.net/fs23/f/2007/322/e/2/Spongebob_Dance_by_Plunkink.gif",
    		defaultInfoContent: 'helloworld'
    	};
    })
	.factory('mapApi', function(restaurant, setting){
		var map = {};
		var restaurants = [];
		var bound = {};
		var markerAndInfo = [];
		var bounds_changed = "";

		var LatLng = function(Lat, Lng){
			return new google.maps.LatLng(Lat, Lng);
		};
		
		var InitMap = function(callback){
			map = new google.maps.Map(document.getElementById("map_canvas"), {
				center: LatLng(25.040757, 121.502882),
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});

			google.maps.event.addListener(map, 'bounds_changed', function(){
				if (bounds_changed) {
					clearTimeout(bounds_changed);
				};
				bounds_changed = setTimeout(function(){
					bound = map.getBounds();
					for (var i = markerAndInfo.length - 1; i >= 0; i--) {
						if (!bound.contains(markerAndInfo[i].marker.getPosition())) {
							markerAndInfo[i].marker.setMap(null);
							markerAndInfo.splice(i, 1);
						}
					}
					restaurants = RestaurantInMap(bound, function(data){
						for (var i = restaurants.length - 1; i >= 0; i--) {
							AddMarker({
								Lat: restaurants[i].Lat, 
								Lng: restaurants[i].Lng, 
								title: restaurants[i].name, 
								infoContent: restaurants[i].name, 
								iconPath: setting.iconPath
							});
						};
					});
				}, 300);
			});

			callback(map, markerAndInfo);
		};


		var AddMarker = function(input){
			for (var i = markerAndInfo.length - 1; i >= 0; i--) {
				var position = markerAndInfo[i].marker.getPosition();
				if (Math.round(position.lat()*100000)/100000 === Math.round(input.Lat*100000)/100000 &&
					Math.round(position.lng()*100000)/100000 === Math.round(input.Lng*100000)/100000 &&
					markerAndInfo[i].infoWindow.getContent() === (input.infoContent || setting.defaultInfoContent)){
					return;
				}
			};
			var markerSetting = {
				title: input.title,
				position: LatLng(input.Lat, input.Lng),
				map: map
		    };
		    if (input.iconPath) {
		    	markerSetting.icon = input.iconPath;
		    };

		    var markerToAdd = new google.maps.Marker(markerSetting);
		    var infoToAdd = new google.maps.InfoWindow({
				content: input.infoContent||defaultContent,
				maxWidth: 400
		    });

		    markerAndInfo.push({marker: markerToAdd, infoWindow: infoToAdd});
		    google.maps.event.addListener(markerToAdd, "click", function(){
				infoToAdd.open(map, markerToAdd);
		    });
		};

		var MapBound = function(){
			return map.getBounds();
		};

		var RestaurantInMap = function(bound, callback){
			return restaurant.InMap({
				sw:{
					Lat:bound.getSouthWest().lat(), 
					Lng:bound.getSouthWest().lng()
				}, 
				ne:{
					Lat:bound.getNorthEast().lat(), 
					Lng:bound.getNorthEast().lng()
				}
			}, callback);
		};

		return {
			AddMarker: AddMarker,
			LatLng: LatLng,
			map: map,
			markerAndInfo: markerAndInfo,
			MapBound: MapBound,
			InitMap: InitMap
		};
	});

