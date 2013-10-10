var mongoose = require('mongoose');
var util = require('util');
var _ = require('underscore');

//var connection_string = 'mongodb://localhost:8000/mitten';
var connection_string = 'mongodb://nodejitsu:35574f1e7c20d3edf04e76363585adf6@paulo.mongohq.com:10021/nodejitsudb9459544566';
var connection = mongoose.connection;
var Schema = mongoose.Schema;

var _util = require('./util');

var HipSchema = new Schema({
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	key: {type: String, unique: true, required: false},
	location: {lat: String, lng: String}
});

var WeatherSchema = new Schema({
	observation_time: Date,
	tempC: Number,
	visibility: Number,
	cloudcover: Number,
	humidity: Number,
	pressure: Number,
	windspeedKmph: Number,
	weatherDesc: [{value: String}],
	winddirection: String,
	hipid: String,
	location: {lat: String, lng: String}
});

var Hip = mongoose.model('Hip', HipSchema);
var Weather = mongoose.model('Weather', WeatherSchema);

module.exports = (function() {	
	// Prototypes
	Date.prototype.addHours = function(h) {
		this.setTime(this.getTime() + (h*60*60*1000))	
		return this;
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
					callback(docs);
				}
			});
		},		
		createHip: function(user, callback) {
			console.log('data.createHip is called');
			console.log('user: %j', user);
		
			var hip = new Hip();
			hip.email = user.email;
			hip.password = user.password;
			hip.location.lat = user.location.lat;
			hip.location.lng = user.location.lng;
			hip.key = user.key || _util.guid();
			hip.save(function(err) {
				if (err) {
					console.log('error creating hip: %j', err);
					callback(err);
				}
				else {
					console.log('hip created');
					callback(null);
				}
			});
		},
		updateHip: function(user, callback) {
			var id = user.id;
			var options = {multi: false};		
			Hip.update({'_id': id}, {
				$set: {'location.lat': user.location.lat, 'location.lng': user.location.lng}
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
		addWeather: function(conds, hip, callback) {
			var w = new Weather();
			w.observation_time = conds.observation_time;
			w.tempC = conds.tempC;
			w.visibility = conds.visibility;
			w.cloudcover = conds.cloudcover;
			w.humidity = conds.humidity;
			w.pressure = conds.pressure;
			w.windspeedKmph = conds.windspeedKmph;
			conds.weatherDesc.forEach(function(i) {
				w.weatherDesc.push({value: i.value});
			});
			w.winddirection = conds.winddirection;
			w.hipid = hip._id,
			w.location.lat = hip.location.lat;
			w.location.lng = hip.location.lng;
			w.save(function(err) {
				if (err)
					callback(err);
				else
					callback(null);
			});
		}
	}
})();