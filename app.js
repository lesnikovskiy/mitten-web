var util = require('util');
var http = require('http');
var path = require('path');
var express = require('express');
var app = module.exports = express();

var _ = require('underscore');

var db = require('./data');
var _util = require('./util');

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

app.get('/trace/weather/:hipid', function(req, res) {
	var data = '';	
	
	if (!db.isConnected)
		db.connect();
		
	var hipid = req.params.hipid;	
	var hip = db.findHipById(hipid, function(err, hip) {
		if (err)
			res.json(err);
						
		http.get({
			host: 'api.worldweatheronline.com',
			port: 80,
			path: '/free/v1/weather.ashx?q=50,30&format=json&num_of_days=1&key=z4bqactn5v7gu6ttdz6agtkd'
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
					winddirection: json.data.current_condition[0].winddir16Point					
				}, hip, function(err) {
					if (err)
						res.json(err);
					else
						res.json(json);
				});
			});
		}).on('error', function (e) {
			res.json(e);
		});
	});	
});

app.get('/api/hip', function (req, res) {
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
	console.log('The app.post is called');
	console.log('req.body: %j', req.body);
	
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