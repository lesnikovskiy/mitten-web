var mittenApp = angular.module('mittenApp', []);

mittenApp.controller('CurrentConditionCtrl', function CurrentConditionCtrl($scope, $http, $window) {
	$scope.error = {
		hasError: false,
		message: 'Error occurred'
	};
	$scope.data = {
		temp_diff: 0,
		show_temp_diff: false,
		current_state: '',
		wind_state: '',
		hips_count: 0,
		tips: [],
		comments: []
	};
	
	function handleLocationError(err) {
		debugger;
		switch (error.code) {
			case 0:
				$scope.error.hasError = true;
				$scope.error.message = 'There was an error while retrieving your location. Additional details: ' + error.message;
				break;
			case 1:
				$scope.error.hasError = true;
				$scope.error.message = 'The user opted not to share his or her location.';
				break;
			case 2:
				$scope.error.hasError = true;
				$scope.error.message = 'The browser was unable to determine your location. Additional details: ' + error.message;
				break;
			case 3:
				$scope.error.hasError = true;
				$scope.error.message = 'The browser timed out before retrieving the location.';
				break;
		}
	}
	
	$scope.getWeather = function () {
		$window.navigator.geolocation.getCurrentPosition(function (pos) {
			var url = '/api/weather/' + pos.coords.latitude + '/' + pos.coords.longitude;
			$http.get(url)
				.success(function (data, status, headers, config) {
					debugger;
					$scope.error.hasError = false;
				
					if (!data.data) {
						$scope.error.hasError = true;
						$scope.error.message = 'Service is not available.';
						return;
					}
					
					if (data.data.temp_diff) {
						$scope.data.temp_diff = data.data.temp_diff;
						$scope.data.show_temp_diff = true;
					} else {
						$scope.data.show_temp_diff = false;
					}
					
					$scope.data.current_state = data.data.current_state;
					$scope.data.wind_state = data.data.wind_state;
					$scope.data.hips_count = data.data.hips_count;
					$scope.data.tips = data.data.tips;
					$scope.data.comments = data.data.comments;
				})
				.error(function (data, status, headers, config) {
					$scope.error.hasError = true;
					$scope.error.message = data && data.message ? data.message : 'AJAX unkown error';
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