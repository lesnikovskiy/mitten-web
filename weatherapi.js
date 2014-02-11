var http = require('http');
var config = require('./config');

module.exports = (function () {
	var host = config.getWeatherApi().host;
	var port = 80;
	var path = config.getWeatherApi().path;
	var params = config.getWeatherApi().params;
	var chunks = [];
	
	return {
		getWeather: function (location, callback) {
			if (!Array.isArray(location))
				return callback('Location should be array, i.e. [50,30]');		
				
			http.get({
				host: host,
				port: port,
				path: path + location[0] + ',' + location[1] + params
			}, function (response) {
				response.setEncoding('utf-8');
				response.on('data', function (chunk) {
					chunks.push(chunk);
				});
				response.on('error', function (e) {
					return callback(e);
				});
				response.on('end', function () {
					var json = JSON.parse(chunks.join(''));
					
					return callback(null, json);
				});
			});
		}
	};
})();