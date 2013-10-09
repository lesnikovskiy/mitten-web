var util = require('util');
var _ = require('underscore');
var uuid = require('node-uuid');

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
		}
	};
})();