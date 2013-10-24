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
					condition: false,
					error: true,
					login: false, 
					register: false
				}
			}
		});
	}
	
	getWeather();
	
	$scope.login = function() {
		$http.post('/api/login', {email: $scope.email, password: $scope.password}).success(function(data) {
			if (data.ok)
				getWeather();
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
	
	};
	
	$scope.logout = function() {
		$http.post('/api/logout').success(function (data) {
			getWeather();
		});
	};
});