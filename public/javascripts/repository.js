angular.module('repository', ['ngResource'])
    .constant('dbcs', '/api/')
    .factory('restaurant', function($resource, dbcs){
		return $resource(dbcs+"restaurant/:suffix", {}, {
			'InMap': {
				method: "POST",
				params: {sw:'@sw', ne:'@ne', suffix:'InMap'}, 
				isArray: true
			}
		});
    })
    ;