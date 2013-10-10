var util = require('util');
var _ = require('underscore');
var uuid = require('node-uuid');
// https://npmjs.org/package/bcrypt-nodejs
var bcrypt = require('bcrypt');

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
		}
	};
})();