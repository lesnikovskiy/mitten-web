var util = require('util');
var http = require('http');
var path = require('path');
var fs = require('fs');
var express = require('express');
var app = module.exports = express();

var _ = require('underscore');
var schedule = require('node-schedule');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var db = require('./data');
var _util = require('./util');
var auth = require('./auth');
var config = require('./config');

var MITTEN_COOKIE_KEY = config.getSessionConfig().COOKIE_KEY;
var MITTEN_SESSION_KEY = config.getSessionConfig().SESSION_KEY;

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

passport.use(new FacebookStrategy({
	clientID: config.getFacebookConfig().clientId,
	clientSecret: config.getFacebookConfig().clientSecret,
	callbackURL: config.getFacebookConfig().callbackURL
}, function (accessToken, refreshToken, profile, done) {	
	process.nextTick(function () {
		console.log(accessToken);
		//console.log(refreshToken);
		//console.log(profile);
		/*
		// todo: locate user in database save or create
		User.findOrCreate(..., function(err, user) {
		  if (err) { return done(err); }
		  done(null, user);
		});
		*/
		return done(null, profile);
	});
}));

db.connect();

app.configure(function() {
	app.set('port', process.env.PORT || 3000);

	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, '/public')));
	app.use(express.cookieParser());
	app.use(express.session({secret: MITTEN_SESSION_KEY}));
	app.use(passport.initialize());
	app.use(passport.session());
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

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/auth/facebook/fail'
}), function (req, res) {
    res.redirect('/');
});

app.get('/auth/facebook/fail', function (req, res) {
    res.json({ok: false, message: 'Failed to auth with facebook'});
});

app.get('/auth/facebook/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/api/weather', auth.ensureAuth, function(req, res) {
	if (!db.isConnected)
		db.connect();
		
	db.allWeather(function (err, docs) {
		if (err)
			res.json(err);
		else
			res.json(docs);
	});
});

app.get('/api/weather/current', auth.ensureAuth, function (req, res) {
	if (!db.isConnected)
		db.connect();
		
	db.findHipByKey(req.cookies.MITTENAUTH, function (err, hip) {
		if (err) {
			res.json({ok: false, type: 'error', error: {message: err.message}});
		} else {
			db.getCurrentWeather(hip.location, function (err, docs) {
				if (err) 
					res.json({ok: false, type: 'error', error: {message: err.message}});
				else {
					res.json({ok: true, data: docs});
				}					
			});
		}
	});	
}); 

app.get('/api/weather/comparable', auth.ensureAuth, function (req, res) {
	if (!db.isConnected)
		db.connect();
	
/*	
	var key = req.cookies.MITTENAUTH || req.body.key;
	
	if (key == null)
		res.json({ok: false, type: 'unauthorized'});*/
		
	db.findHipByKey(req.cookies.MITTENAUTH, function (err, hip) {
		if (err) {
			res.json({ok: false, type: 'error', error: {message: err.message}});
		} else {
		// TODO: revise this functionality
		/*
			db.comparableWeather(hip.location[0], hip.location[1], function (err, docs) {
				if (err) 
					res.json({ok: false, type: 'error', error: {message: err.message}});
				else {
					res.json({ok: true, data: docs});
				}					
			});*/
		}
	});
}); 

app.post('/api/login', function(req, res) {	
	var email = req.body.email;
	var pass = req.body.password;
	if (!_.has(req.body, 'email') || !_.has(req.body, 'password')) {
		res.json({ok: false, type: 'error', error: {message: 'credentials are not provided'}});
	}
	
	if (!db.isConnected)
		db.connect();
	
	db.findHipByParams({email: email}, function (err, hip) {
		console.log('Result of search hip: %j', hip);
		if (err) {
			res.json({ok: false, type: 'error', error: {message: err.message}});
		} else  if (hip == null) {
			res.json({ok: false, type: 'error', error: {message: 'Email is wrong. Please register or verify if email is correct.'}});
		} else {		
			if (!pass || hip.password !== pass)
				res.json({ok: false, type: 'error', error: {message: 'password is wrong'}});			
			else {
				var sessionGuid = _util.guid();
				db.setHipKey(hip, sessionGuid, function (err, affected) {
					if (err) {
						res.json({ok: false, type: 'error', error: {message: err.message}});
					} 
					
					if (affected == 1) {
						res.cookie(MITTEN_COOKIE_KEY, sessionGuid, {httpOnly: true});
						res.json({ok: true, key: sessionGuid});
					} else {
						res.json({ok: false, type: 'error', error: {message: 'Authentication error!'}});
					}
				});			
			}
		}
	});			
});

app.post('/api/logout', function (req, res) {
	res.cookie(MITTEN_COOKIE_KEY, '', {httpOnly: true, expires: new Date(new Date().setDate(-1))});
	res.json({ok: true});
});

app.get('/api/hip', auth.ensureAuth, function (req, res) {
	if (!db.isConnected)
		db.connect();
		
	db.allHips(function(err, docs) {
		if (err)
			res.json(err);
		else
			res.json(docs);
	});
});

app.get('/api/hip/:id', auth.ensureAuth, function(req, res) {
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
		
	console.log('POST /api/hip called with params: %j', req.body);
		
	var email = req.body.email;
		
	db.createHip({
		email: email,
		password: req.body.password,
		location: {
			lat: req.body.location.lat,
			lng: req.body.location.lng
		}
	}, function(err, hip) {
		if (err) {
			console.log('Create hip error: %j', err);
			var errMsg = err.code == 11000 ? 'User with email "' + email + '" is already registered' : err.message;
			res.json({ok: false, type: 'error', error: {message: err.message, stack: err.stack}});	
		} else {
			if (hip && hip.key) {
				res.cookie(MITTEN_COOKIE_KEY, hip.key, {httpOnly: true});
				res.json({ok: true, data: hip});
			} else {
				res.json({ok: false, type: 'error', error: {message: 'Registration failed!'}});
			}
		}
	});
});

app.post('/api/hip/search', auth.ensureAuth, function (req, res) {
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

app.get('/err', function(req, res) {
	throw new Error(200, 'not ok');
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server is listening on port: ' + app.get('port'));
});

var rule = new schedule.RecurrenceRule();
//rule.second = 2;
rule.minute = 15;
//rule.hour = 1;
console.log('%j', rule);
var j = schedule.scheduleJob(rule, function() {
	if (!db.isConnected)
		db.connect();
		
	db.distinctLocations(function (err, docs) {
		if (err) {
			console.log(err);
			return;
		} else if (docs) {
			Array.prototype.forEach.call(docs, function (doc) {
				console.log('docs.forEach item : %j', doc);
				
				if (doc._id.lat && doc._id.lng) {
					// Send no more than 1 request per second
					setInterval(function () {
						try {
							var data = '';
			
							http.get({
								host: 'api.worldweatheronline.com',
								port: 80,
								path: '/free/v1/weather.ashx?q=' 
										+ doc._id.lat 
										+ ',' 
										+ doc._id.lng 
										+ '&format=json&num_of_days=1&fx=yes&cc=yes&includelocation=yes&show_comments=no&key=z4bqactn5v7gu6ttdz6agtkd'
							}, function(response) {
								response.setEncoding('utf-8');
								response.on('data', function(chunk) {
									data += chunk;
								}).on('end', function() {
									console.log('Document retrieved from 3rd party service:');
									console.log(util.inspect(data));
									
									try {										
										var json = JSON.parse(data);									
										
										var currentCondition = json.data.current_condition[0];
										var nearestArea = json.data.nearest_area[0];
										
										var lat = nearestArea && nearestArea.latitude ? nearestArea.latitude : doc._id.lat;
										var lng = nearestArea && nearestArea.longitude ? nearestArea.longitude : doc._id.lng;
										
										db.addWeather({
											tempC: currentCondition.temp_C,
											visibility: currentCondition.visibility,
											cloudcover: currentCondition.cloudcover,
											humidity: currentCondition.humidity,
											pressure: currentCondition.pressure,
											windspeedKmph: currentCondition.windspeedKmph,
											weatherCode: currentCondition.weatherCode,
											winddirection: currentCondition.winddir16Point,
											location: [lat, lng]
										}, function(err) {
											if (err)
												console.log('Error saving weather: %j', err);
										});
									} catch (e) {
										console.log('Could not parse JSON: %j', e);
									}
								}).on('error', function (e) {
									console.log('Error getting weather from 3rd party service: %j', e);
								});
							});
						} catch (e) {
							console.log('Error occurred: %j', e);
						}
					}, 2000);
				}
				
			});
		}
	});		
});

app.on('close', function() {
	db.disconnect(function(err) {
		console.log(err);
	});
});
