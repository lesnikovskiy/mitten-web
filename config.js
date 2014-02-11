var nconf = require('nconf');

module.exports = (function () {
	nconf.use('file', {file: './config/config.json'});
	nconf.load();
	
	return {
		getFacebookConfig: function () {
			return nconf.get('facebook');
		},
		getMongoConfig: function () {
			return nconf.get('mongodb');
		},
		getSessionConfig: function() {
			return nconf.get('session');
		},
		getWeatherApi: function () {
			return nconf.get('weatherApi');
		}
	};
})();
