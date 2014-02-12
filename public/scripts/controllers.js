var mittenApp = angular.module('mittenApp', []);

mittenApp.controller('CurrentConditionCtrl', function CurrentConditionCtrl($scope, $http, $window) {
	$scope.locationError;
	$scope.data = {};
	
	function handleLocationError(err) {
		debugger;
		switch (error.code) {
			case 0:
				$scope.locationError = 'There was an error while retrieving your location. Additional details: ' + error.message;
				break;
			case 1:
				$scope.locationError = 'The user opted not to share his or her location.';
				break;
			case 2:
				$scope.locationError = 'The browser was unable to determine your location. Additional details: ' + error.message;
				break;
			case 3:
				$scope.locationError = 'The browser timed out before retrieving the location.';
				break;
		}
	}
	
	$scope.getWeather = function () {
		$window.navigator.geolocation.getCurrentPosition(function (pos) {
			var url = '/api/weather/' + pos.coords.latitude + '/' + pos.coords.longitude;
			$http.get(url)
				.success(function (data, status, headers, config) {
					debugger;
					if (data.data)
						$scope.data = data;
				})
				.error(function (data, status, headers, config) {
				
				});
		}, handleLocationError);
	};		
	
	$scope.logout = function() {
		$http.get('/auth/facebook/logout').success(function (data) {
			//getWeather();
		});
	};
	
	$scope.getWeather();
});