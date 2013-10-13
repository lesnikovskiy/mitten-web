var mongoose = require('mongoose');
var util = require('util');
var _ = require('underscore');
var bcrypt = require('bcrypt-nodejs');

var connection_string = 'mongodb://localhost:8000/mitten';
//var connection_string = 'mongodb://nodejitsu:35574f1e7c20d3edf04e76363585adf6@paulo.mongohq.com:10021/nodejitsudb9459544566';
var connection = mongoose.connection;
var Schema = mongoose.Schema;

var _util = require('./util');

/****************** Schema ***************/
var HipSchema = new Schema({
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	key: {type: String, unique: true, required: false},
	created: Date,
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
	location: {lat: String, lng: String}
});

/**************** Model ***********************/
var Hip = mongoose.model('Hip', HipSchema);
var Weather = mongoose.model('Weather', WeatherSchema);

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
			console.log('data.createHip is called');
			console.log('user: %j', user);
		
			var hip = new Hip();
			hip.email = user.email;
			//hip.password = bcrypt.hashSync(user.password); // bcrypt.compareSync(userPass, hash);
			hip.password = user.password;
			hip.location.lat = user.location.lat;
			hip.location.lng = user.location.lng;
			hip.key = user.key || _util.guid();
			hip.created = new Date().toUTC();
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
		addWeather: function(conds, callback) {
			var w = new Weather();
			w.observation_time = conds.observation_time.toUTC();
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
			w.location.lat = w.location.lat;
			w.location.lng = w.location.lng;
			w.save(function(err) {
				if (err)
					callback(err);
				else
					callback(null);
			});
		},
		allWeather: function (callback) {
			Weather.find({}, function (err, docs) {
				if (err)
					callback(err);
				else
					callback(null, docs);
			});
		},
		distinctLocations: function(callback) {
			var o = {};
			o.map = function() {
				emit(this._id, {lat: Math.floor(this.location.lat), lng: Math.floor(this.location.lng)});
			};
			o.reduce = function (key, values) {
				console.log('reduce called');
				console.log('key: %j', key);
				console.log('values: %j', values);
			};
			o.out = {replace: 'locations' }
			o.verbose = true;
			Hip.mapReduce(o, function (err, model, stats) {
				console.log('map reduce took %d ms', stats.processtime);
				model.find().exec(function (err, docs) {
					if (err)
						return callback(err);
						
					if (docs)
						return callback(null, docs);
				});
				// Todo: find the way to group
				/*
				model.group({'value.lat':1, 'value.lng':1}).exec(function (err, docs) {
					if (err)
						return callback(err);
						
					if (docs)
						return callback(null, docs);
				});*/
			});
		}
	}
})();