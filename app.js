var util = require('util');
var http = require('http');
var path = require('path');
var express = require('express');
var app = module.exports = express();

var _ = require('underscore');
var schedule = require('node-schedule');

var db = require('./data');
var _util = require('./util');

db.connect();

db.distinctLocations(function (err, docs) {
	if (err)
		console.log(err);
	if (docs)
		console.log(docs);
});

db.closestLocation(48, 28, function (err, doc) {
	if (err)
		console.log(err);
	else
		console.log(doc);
});

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

app.get('/api/weather', function(req, res) {
	if (!db.isConnected)
		db.connect();
		
	db.allWeather(function (err, docs) {
		if (err)
			res.json(err);
		else
			res.json(docs);
	});
});

app.post('/api/login', function(req, res) {	
	var email = req.body.email;
	var pass = req.body.password;
	if (!email || !pass) {
		res.json({ok: false, error: {message: 'credentials are not provided'}});
	}
	
	if (!db.isConnected)
		db.connect();
	
	var hip = db.findHipByParams({email: email}, function (err, hip) {
		if (err) {
			res.json({ok: false, error: {message: err.message}});
		}
		if (!hip)
			res.json({ok: false, error: {message: 'Email is wrong. Please register or verify if email is correct.'}});
		
		if (hip.password === pass)
			res.json({ok: true, location: '/'});
		else 
			res.json({ok: false, error: {message: 'password is wrong'}});
	});			
});

app.get('/api/hip', function (req, res) {
	if (!db.isConnected)
		db.connect();
		
	db.allHips(function(err, docs) {
		if (err)
			res.json(err);
		else
			res.json(docs);
	});
});

app.get('/api/hip/:id', function(req, res) {
	var id = req.params.id;
	
	if (!db.isConnected)
		db.connect();
	
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

app.post('/api/hip', function(req, res) {	
	if (!db.isConnected)
		db.connect();
		
	db.createHip({
		email: req.body.email,
		password: req.body.password,
		key: req.body.key,
		location: {
			lat: req.body.location.lat,
			lng: req.body.location.lng
		}
	}, function(err) {
		if (err) 
			res.json({ok: false, message: err.message, stack: err.stack});		
		else
			res.json({ok: true});
	});
});

app.post('/api/hip/search', function (req, res) {
	if (!db.isConnected)
		db.connect();
		
	var searchParams = _util.formatSearchParameters(req.body);
	if (_.has(searchParams, 'ok') && !searchParams.ok) {
		res.json(searchParams);
	}
	
	console.log(searchParams);
	
	db.findHipByParams({
		email: req.body.email
	}, function(err, doc) {
		if (err)
			res.json({ok: false, message: err.message, stack: err.stack});
		else
			res.json(doc);
	});
});

app.put('/api/hip', function(req, res) {
	if (!db.isConnected)
		db.connect();
		
	db.updateHip({
		id: req.body.id,
		location: {
			lat: req.body.location.lat,
			lng: req.body.location.lng
		}
	}, function(err) {
		if (err) 
			res.json({ok: false, message: err.message, stack: err.stack || ''});		
		else
			res.json({ok: true});
	});
});

app.get('/err', function(req, res) {
	throw new Error(200, 'not ok');
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server is listening on port: ' + app.get('port'));
});

var rule = new schedule.RecurrenceRule();
//rule.second = 30;
rule.hour = 1;
console.log('%j', rule);
var j = schedule.scheduleJob(rule, function() {
	if (!db.isConnected)
		db.connect();
		
	db.findHipByParams({email: 'lesnikovski@gmail.com'}, function(err, hip) {
		if (err)
			console.log('Error: %j', err);
			
		var data = '';
		
		http.get({
			host: 'api.worldweatheronline.com',
			port: 80,
			path: '/free/v1/weather.ashx?q=' + hip.location.join(',') + '&format=json&num_of_days=1&key=z4bqactn5v7gu6ttdz6agtkd'
		}, function(response) {
			response.setEncoding('utf-8');
			response.on('data', function(chunk) {
				data += chunk;
			}).on('end', function() {
				var json = JSON.parse(data);
				db.addWeather({
					observation_time: new Date(),
					tempC: json.data.current_condition[0].temp_C,
					visibility: json.data.current_condition[0].visibility,
					cloudcover: json.data.current_condition[0].cloudcover,
					humidity: json.data.current_condition[0].humidity,
					pressure: json.data.current_condition[0].pressure,
					windspeedKmph: json.data.current_condition[0].windspeedKmph,
					weatherDesc: json.data.current_condition[0].weatherDesc,
					winddirection: json.data.current_condition[0].winddir16Point,
					location: hip.location
				}, function(err) {
					if (err)
						console.log(err);
					else
						console.log(json);
				});
			});
		}).on('error', function (e) {
			console.log(e);
		});
	});
});

app.on('close', function() {
	j.cancel();
	db.disconnect(function(err) {
		console.log(err);
	});
});