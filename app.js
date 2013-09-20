var path = require('path');
var express = require('express');
var app = module.exports = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');

app.configure(function() {
	app.set('port', process.env.PORT || 3000);

	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, '/public')));
	app.use(express.cookieParser());
	app.use(app.router);
	app.use(express.errorHandler({
		dumpExceptions: true, 
		showStack: true
	}));
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.send(500, 'Server error');
});

app.get('/err', function(req, res) {
	throw new Error(200, 'not ok');
});

app.get('/test', function(req, res) {
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback() {
		res.json(JSON.stringify({msg: 'db opened'}));
	});
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server is listening on port: ' + app.get('port'));
});
