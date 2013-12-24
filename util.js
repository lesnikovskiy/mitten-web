var util = require('util');
var _ = require('underscore');
var uuid = require('node-uuid');
// https://npmjs.org/package/bcrypt-nodejs
var bcrypt = require('bcrypt-nodejs');

module.exports = (function() {
	return {
		formatSearchParameters: function (params) {
			if (!_.isObject(params) && _.isEmpty(params)) {
				return {ok: false, message: 'params should be of type Object and be non empty'};
			}
		
			var searchParams = {};
			for (var i in params) {
				switch (i) {
					case 'email':
						searchParams.email = new RegExp('^' + params[i] + '$', 'i');
						break;
					case 'password':
						searchParams.password = params[i];
						break;
					case 'key':
						searchParams.key = params[i]
						break;
					default:
						break;
				}
			}
			
			return searchParams;
		},
		guid: function() {
			return uuid.v1();
		},
		encryptPassword: function(password, callback) {
			bcrypt.genSalt(10, function (err, salt) {
				if (err)
					return callback(err);
				else 
					bcrypt.hash(password, salt, function (err, hash) {
						return callback(err, hash);
					});
			});
		},
		comparePassword: function (password, userPass, callback) {
			bcrypt.compare(password, userPass, function (err, isMatch) {
				if (err) 
					return callback(err);
				else
					return callback(null, isMatch);
			});
		},
		getHumidex: function (temp, humidity) {
			var t = parseFloat(temp);
			var h = parseFloat(humidity);
			var e1 = (6.112*Math.pow(10, (7.5*t/(237.7+t))*h/100));
			var humidex = t + (0.5555*(e1-10));
			
			return Math.round(humidex);
		},
		getDewPoint: function (temp, humidity) {
			var t = parseFloat(temp);
			var h = parseFloat(humidity);
			
			var intermediateValue = (Math.log(h / 100) + ((17.27 * t) / (237.3 + t))) / 17.27;
			var dewpoint = (237.3 * intermediateValue) / (1 - intermediateValue);
			
			return Math.round(dewpoint);
		},
		getWindChill: function (temp, windSpeed) {
			var t = parseFloat(temp);
			var w = parseFloat(windSpeed);
			
			var windChillTemp = 0.045*(5.2735*Math.sqrt(w) + 10.45 - 0.2778*w)*(t - 33.0)+33;
			
			return Math.round(windChillTemp);
		},
		getTempDiff: function (curr, prev) {
			var tempState = {
				diff: 0,
				phrase: '',
				color: '#FFF'
			};
			
			if (curr && prev) {
				var currTemp = curr.tempC;
				var prevTemp = prev.tempC;
				tempState.diff = currTemp - prevTemp;
				
				if (currTemp > prevTemp) {
					var pDiff = currTemp - prevTemp;
					tempState.phrase = 'It got warmer: '					
						+ pDiff 
						+ ' ' 
						+ (pDiff != 1 ? 'degree' : 'degrees')
						+ ' difference';
					tempState.color = 'yellow';
				} else if (currTemp < prevTemp) {
					var mDiff = prevTemp - currTemp;
					tempState.phrase = 'It got colder: '					
						+ mDiff 
						+ ' ' 
						+ (mDiff != 1 ? 'degree' : 'degrees')
						+ ' difference';
					tempState.color = 'blue';
				}
			}
			
			return tempState;
		}
	};
})();