var util = require('util');
var http = require('http');
var path = require('path');
var express = require('express');
var app = module.exports = express();

var db = require('./data');
db.connect();

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
	app.use(function(err, req, res, next) {
		console.error(err.stack);
		res.send(500, 'Server error');
	});
});

app.on('close', function() {
	db.disconnect(function(err) {
		console.log(err);
	});
});

app.post('/create-hip', function(req, res) {
	db.createHip({
		email: req.body.email,
		password: req.body.password,
		lat: req.body.lat,
		lng: req.body.lng
	}, function(err) {
		if (err) 
			res.json({ok: false, message: err.message, stack: err.stack});		
		else
			res.json({ok: true});
	});
});

app.post('/update-hip', function(req, res) {
	db.createHip({
		lat: req.body.lat,
		lng: req.body.lng
	}, function(err) {
		if (err) 
			res.json({ok: false, message: err.message, stack: err.stack || ''});		
		else
			res.json({ok: true});
	});
});

app.post('/find-hip-by-email', function(req, res) {
	var email = req.body.email;
	db.findHipByEmail(email, function(err, doc) {
		if (err)
			res.json({ok: false, message: err.message, stack: err.stack});
		else {
			if (!doc)
				res.json({ok: false, message: 'Nothing found by email: ' + email});
			else
				res.json(doc);
		}
	});
});

app.post('/find-hip-by-id', function(req, res) {
	var id = req.body.id;
	db.findHipById(id, function(err, doc) {
		if (err)
			res.json({ok: false, message: err.message, stack: err.stack});
		else {
			if (!doc)
				res.json({ok: false, message: 'Nothing found by email: ' + email});
			else
				res.json(doc);
		}
	});
});

app.get('/err', function(req, res) {
	throw new Error(200, 'not ok');
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server is listening on port: ' + app.get('port'));
});