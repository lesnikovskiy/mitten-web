var util = require('util');
var db = require('./data');

var MITTEN_COOKIE_KEY = 'MITTENAUTH';

module.exports = (function() {
	return {
		authenticate: function (req, res, next) {
			console.log('authenticate triggered');
			if (!req.cookies || !req.cookies.MITTENAUTH) {
				res.json({ok: false, type: 'unauthorized'});
			} else {
				db.findHipByKey(req.cookies.MITTENAUTH, function (err, hip) {
					if (err) {
						res.json({ok: false, type: 'unauthorized', error: {message: err.message}});
					} else {
						if (hip && hip.key === req.cookies.MITTENAUTH)
							next();
						else 
							res.json({ok: false, type: 'unauthorized'});
					}
				});
			}
		},
		ensureAuth: function (req, res, next) {
			if (req.isAuthenticated()) {
				return next();
			}
			
			res.redirect('/auth/facebook');
		}
	};
})();