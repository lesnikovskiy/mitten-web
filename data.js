var mongoose = require('mongoose');
var util = require('util');
var _ = require('underscore');
var bcrypt = require('bcrypt-nodejs');

var connection_string = 'mongodb://localhost:8000/mitten';

var connection = mongoose.connection;
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var _util = require('./util');

/****************** Schema ***************/
var HipSchema = new Schema({
	email: {type: String, required: true, unique: true, validate: function(v) {
		return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/i.test(v);
	}},
	password: {type: String, required: true},
	key: {type: String, unique: true, required: true},
	created: {type: Date, default: Date.now},
	location: {type: [Number], index: {location: '2d'}}
});

var WeatherSchema = new Schema({
	observation_time: {type: Date, default: Date.now},
	tempC: {type: Number, required: true},
	visibility: {type: Number, required: false},
	cloudcover: {type: Number, required: false},
	humidity: {type: Number, required: true},
	pressure: {type: Number, required: false},
	windspeedKmph: {type: Number, required: true},
	weatherCode: {type: Number, required: true},
	winddirection: String,
	location: {type: [Number], index: {location: '2d'}},
	humidex: Number,
	dewPoint: Number,
	windChill: Number
});
// todo: add insureIndex implicitly as mongoose doesn't not create it.

var TempReferenceSchema = new Schema({
	range: [Number],
	phraseEN: String,
	phraseRU: String
});

var WindReferenceSchema = new Schema({
	range: [Number],
	phraseEN: String,
	phraseRU: String
});

var WeatherCodeSchema = new Schema({
	code: {type: Number, required: true},
	description: {type: String, required: true},
	phraseEN: String,
	phraseRU: String
});

/**************** Model ***********************/
var Hip = mongoose.model('Hip', HipSchema);
var Weather = mongoose.model('Weather', WeatherSchema);

var Temp = mongoose.model('Temp', TempReferenceSchema);
var Wind = mongoose.model('Wind', WindReferenceSchema);
var WeatherCode = mongoose.model('WeatherCode', WeatherCodeSchema);

/**************** mapReduce *******************/


module.exports = (function() {	
	// Prototypes
	Date.prototype.addHours = function(h) {
		this.setTime(this.getTime() + (h*60*60*1000))	
		return this;
	};
	
	Date.prototype.toUTC = function() {
		return new Date(new Date(this.getTime() + this.getTimezoneOffset() * 60000));
	};

	connection.on('error', console.error.bind(console, 'connection error: '));
	connection.once('open', function callback() {
		console.log('Successfully connected to %s', connection_string);
	});	
	
	return {
		connected: 1,
		disconnected: 2,
		isConnected: function() {
			return connection.readyState == this.connected;
		},
		connect: function () {
			if (connection.readyState !== this.connected)
				mongoose.connect(connection_string);
		},
		disconnect: function(callback) {
			mongoose.disconnect(callback);
		},
		// Hip CRUD
		allHips: function(callback) {
			Hip.find({}, function(err, docs) {
				if (err) {
					console.log('error in data.allHips: %j', err);
					callback(err)
				} else {
					console.log('docs find in data.allHips: %j', docs);
					callback(null, docs);
				}
			});
		},		
		createHip: function(user, callback) {		
			var hip = new Hip();
			hip.email = user.email;
			//hip.password = bcrypt.hashSync(user.password); // bcrypt.compareSync(userPass, hash);
			hip.password = user.password;
			hip.location.push(user.location.lat);
			hip.location.push(user.location.lng);
			hip.key = _util.guid();
			hip.created = new Date().toUTC();
			hip.save(function(err, hip) {
				if (err) {
					console.log('error creating hip: %j', err);
					return callback(err);
				}
				else {
					return callback(null, hip);
				}
			});
		},
		setHipKey: function (hip, key, callback) {
			Hip.update({'_id': hip._id}, {key: key}, function (err, affected) {
				if (err)
					return callback(err);
				else
					return callback(null, affected);
			});
		},
		findHipByKey: function (key, callback) {
			Hip.findOne({key: key}, function (err, hip) {
				if (err) 
					return callback(err);
				else
					return callback(null, hip);
			});
		},
		updateHip: function(user, callback) {
			var id = user.id;
			var options = {multi: false};		
			Hip.update({'_id': id}, {
				// todo: add normal location.
				$pushAll: {location: [user.location.lat, user.location.lng]}
			}, options, function(err, affected) {
				if (err) {
					callback(err);
				} else {
					if (affected > 0)
						callback(null, {ok: true, affected: affected});
					else
						callback({ok: false, affected: affected});
				}
			});
		},
		findHipByParams: function (params, callback) {
			var searchParams = _util.formatSearchParameters(params);
			if (_.has(searchParams, 'ok') && !searchParams.ok)
				callback(searchParams);
				
			var and = {
				$and: [searchParams]
			};
				
			console.log(and);
			
			Hip.findOne(and, function (err, doc) {
				if (err)
					callback(err);
				else
					callback(null, doc);
			});
		},
		findHipById: function(id, callback) {
			Hip.findOne({_id: id}, function(err, doc) {
				if (err)
					callback(err);
				else
					callback(null, doc);
			});
		},
		// Weather CRUD
		addWeather: function(conds, callback) {
			var w = new Weather();
			w.observation_time = conds.observation_time.toUTC();
			w.tempC = conds.tempC;
			w.visibility = conds.visibility;
			w.cloudcover = conds.cloudcover;
			w.humidity = conds.humidity;
			w.pressure = conds.pressure;
			w.windspeedKmph = conds.windspeedKmph;
			w.weatherCode = conds.weatherCode;
			w.winddirection = conds.winddirection;
			w.location = conds.location;
			w.humidex = _util.getHumidex(conds.tempC, conds.humidity);
			w.dewPoint = _util.getDewPoint(conds.tempC, conds.humidity);
			w.windChill = _util.getWindChill(conds.tempC, conds.windspeedKmph);
			w.save(function(err) {
				if (err)
					callback(err);
				else
					callback(null);
			});
		},
		allWeather: function (callback) {
			Weather.find({}).sort({_id: -1}).exec(callback);
		},
		distinctLocations: function(callback) {
			var o = {};
			o.map = function() {
				var key = { 
					lat: parseFloat(this.location[0]).toFixed(4), 
					lng: parseFloat(this.location[1]).toFixed(4)
				};
				emit(key, {count: 1});
			};
			o.reduce = function (key, values) {
				print(JSON.stringify(key));
				print(JSON.stringify(values));
				var sum = 0;
				values.forEach(function (v) {
					sum += v['count'];
				});
				
				return { count: sum };
			};
			Hip.mapReduce(o, function (err, docs) {
				if (err)
					return callback(err);
				if (docs)
					return callback(null, docs);
			});
		},/*
		testWeather: function (lat, lng, callback) {
			Weather				
				.where('location')
				.near([lat, lng])
				.maxDistance(30)
				.where('observation_time')
				.lte(new Date(2013, 9, 16, 9, 9, 0).toISOString())
				.sort({_id: -1}) // desc
				//.limit(1)
				.exec(callback);
		},*/
		lastClosestLocation: function (lat, lng, callback) {
			Weather				
				.where('location')
				.near([lat, lng])
				.maxDistance(30)
				.sort({_id: -1}) // desc
				.limit(1)
				.exec(callback);
		},
		closestLocation: function(date, lat, lng, callback) {
			// use geospatial api
			Weather				
				.where('location')
				.near([lat, lng])
				.maxDistance(30)
				.where('observation_time')
				.lte(date.toISOString())
				.sort({_id: -1}) // desc
				.limit(1)
				.exec(callback);
			/* Variant 2: redundant letters
			Weather.find({
				observation_time: {$lt: date.toUTC()},
				location: {					
					$near: [lat, lng],
					$maxDistance: 30
				}
			}, function (err, docs) {
				if (err)
					return callback(err);
				if (docs)
					return callback(docs);
			});*/
		},
		clearDatabase: function(callback) {
			Weather.remove({}, function (err) {
				if (err)
					return callback (err);
				else {
					Hip.remove({}, function(err) {
						if (err)
							return callback(err);
						else 
							return callback({ok: true});
					});
				}
			});
		},
		addWindReference: function(w, callback) {
			var wind = new Wind();
			wind.range = w.range;
			wind.phraseEN = w.phraseEN;
			wind.phraseRU = w.phraseRU;
			wind.save(function (err, wind) {			
				if (err) {
					console.log(err);
					return callback(err);
				} else {
					console.log(wind);
					return callback(null, wind);
				}
			});
		},
		addTempReference: function (t, callback) {
			var temp = new Temp();
			temp.range = t.range;
			temp.phraseEN = t.phraseEN;
			temp.phraseRU = t.phraseRU;
			temp.save(function(err, tmp) {
				if (err)
					return callback(err);
				else
					return callback(null, tmp);
			});
		},
		addWeatherCode: function (c, callback) {
			var code = new WeatherCode();
			code.code = c.code;
			code.description = c.description;
			code.phraseEN = c.phraseEN;
			code.phraseRU = c.phraseRU;
			
			code.save(function(err, doc) {
				if (err)
					return callback(err);
				else
					return callback(null, doc);
			});
		},
		findTemp: function (t, callback) {
			Temp.find({}, function (err, docs) {				
				if (err) {
					return callback(err);
				} else {
					docs.forEach(function (d) {
						if (t >= d.range[0] && t <= d.range[1]) {							
							return callback(null, d);
						}
					});
				}
			});
		},
		findWind: function (w, callback) {
			Wind.find({}, function (err, docs) {
				if (err) {
					return callback(err);
				} else {
					docs.forEach(function (d) {
						if (w >= d.range[0] && w <= d.range[1]) {
							return callback(null, d);
						}
					});
				}
			});
		},
		comparableWeather: function (lat, lng, callback) {
			Weather				
				.where('location')
				.near([lat, lng])
				.maxDistance(30)
				.sort({_id: -1})
				.limit(1)
				.exec(function (err, current) {
					if (err)
						return callback(err);
					else 
						Weather				
							.where('location')
							.near([lat, lng])
							.maxDistance(30)
							.where('observation_time')
							.lte(new Date().addHours(-24).toISOString())
							.sort({_id: -1})
							.limit(1)
							.exec(function (err, prev) {
								var c = current[0];
								var p = prev[0];
								console.log('current weather: %j', c);
								console.log('prev weather: %j', p);
								if (err) {
									return callback (err);
								}
								else {
									if (c != null && p != null) {
										var weatherState = {
											current_condition: c
										};				
										
										Temp.find({}, function (err, docs) {
											if (err) {
												return callback(err);
											} else {
												var diff = c.tempC - p.tempC;
												docs.forEach(function (d) {
													if (diff >= d.range[0] && diff <= d.range[1]) {														
														weatherState.tempDiff = {
															tempDiff: diff,
															phraseEN: d.phraseEN,
															phraseRU: decodeURIComponent(d.phraseRU)
														};
														
														return;
													}
												});											
																								
												Wind.find({}, function (err, docs) {
													if (err)
														return callback (err);
													else {
														var windSpeed = c.windspeedKmph;
														docs.forEach(function (doc) {
															if (windSpeed >= doc.range[0] && windSpeed <= doc.range[1]) {
																weatherState.windState = {
																	phraseEN: doc.phraseEN,
																	phraseRU: decodeURIComponent(doc.phraseRU)
																};
															}
															
															return;
														});
														
														return callback(null, weatherState);
													}
												});
											}											
										});	
									} else {
										return callback(null, c);
									}
								}
							});
				});
		}
	};
})();