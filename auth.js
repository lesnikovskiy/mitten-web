var util = require('util');
var db = require('./data');

var MITTEN_COOKIE_KEY = 'MITTENAUTH';

module.exports = (function() {
	return {
		authenticate: function (req, res, next) {
			console.log('authenticate triggered');
			if (!req.cookies || !req.cookies.MITTENAUTH) {
				res.redirect('/login');
			} else {
				db.findHipByKey(req.cookies.MITTENAUTH, function (err, hip) {
					if (err) {
						console.log(err);
						res.redirect('/login');
					} else {
						if (hip && hip.key === req.cookies.MITTENAUTH)
							next();
						else 
							res.redirect('/login');
					}
				});
			}
		}
	};
})();