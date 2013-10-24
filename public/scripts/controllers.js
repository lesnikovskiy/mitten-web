var mittenApp = angular.module('mittenApp', []);

mittenApp.controller('CurrentConditionCtrl', function CurrentConditionCtrl($scope, $http) {
	function getWeather() {
		$http.get('api/weather/comparable').success(function (data) {
			if (data.ok && data.data && data.data) {			
				$scope.currentState = data.data;
				$scope.content = {
					condition: true,
					error: false,
					login: false, 
					register: false
				}
			} else if (!data.ok && data.type == 'unauthorized') {
				$scope.content = {
					condition: false,
					error: false,
					login: true, 
					register: false
				}
			} else {
				$scope.error = {
					message: data.error.message
				};
				$scope.content = {
					condition: true,
					error: true,
					login: false, 
					register: false
				};
			}
		});
	}
	
	getWeather();
	
	$scope.login = function() {
		$http.post('/api/login', {email: $scope.email, password: $scope.password}).success(function(data) {
			if (data.ok) {
				getWeather();
			} else {
				$scope.content = {
					condition: false,
					error: true,
					login: true, 
					register: false
				};
				$scope.error = {
					message: data.error.message
				};
			}
		});
	};
	
	$scope.showRegister = function() {
		$scope.content = {
			condition: false,
			error: false,
			login: false, 
			register: true
		};
	};
	
	$scope.register = function() {
		$.mobile.loading('show');
		navigator.geolocation.getCurrentPosition(function (pos) {
			if (pos.coords) {
				var lat = pos.coords.latitude;
				var lng = pos.coords.longitude;
				$http.post('/api/hip', {
					email: $scope.email,
					password: $scope.password,
					location: { lat: lat, lng: lng }
				}).success(function (data) {
					if (data.ok) {
						getWeather();
					} else {
						$scope.content = {
							condition: false,
							error: true,
							login: false, 
							register: true
						};
						$scope.error = {
							message: data.error.message || 'unkown error'
						};
					}
					$.mobile.loading('hide');
				});
			} else {
				$scope.content = {
					condition: false,
					error: true,
					login: false, 
					register: true
				};
				$scope.error = {
					message: 'Coordinates not found'
				};
				$.mobile.loading('hide');
			}
		}, function (err) {
			$scope.content = {
				condition: false,
				error: true,
				login: false, 
				register: true
			};
			switch (err.code) {
				case 0:
					$scope.error = {
						message: 'There was an error while retrieving your location: ' + err.message
					};
					$.mobile.loading('hide');
					break;
				case 1:
					$scope.error = {
						message: 'The location is turned off. Please turn on location in your browser settings. Error details: ' + err.message
					};
					$.mobile.loading('hide');
					break;
				case 3:
					$scope.error = {
						message: 'The browser timed out before retrieving the location.'
					};
					$.mobile.loading('hide');
					break;
				default:
					$scope.error = {
						message: 'Unknown geolocation error.'
					};
					$.mobile.loading('hide');
					break;
			}
		});
	};
	
	$scope.logout = function() {
		$http.post('/api/logout').success(function (data) {
			getWeather();
		});
	};
});