var mongoose = require('mongoose');
var util = require('util');

var connection_string = 'mongodb://localhost:8000/mitten';
var connection = mongoose.connection;
var Schema = mongoose.Schema;

var HipSchema = new Schema({
	email: {type: String, unique: true},
	password: String,
	lat: String,
	lng: String
});

var Hip = mongoose.model('Hip', HipSchema);

module.exports = (function() {	
	connection.on('error', console.error.bind(console, 'connection error: '));
	connection.once('open', function callback() {
		console.log('Successfully connected to %s', connection_string);
	});	
	
	return {
		connect: function () {
			mongoose.connect(connection_string);
		},
		disconnect: function(callback) {
			mongoose.disconnect(callback);
		},
		createHip: function(user, callback) {
			var hip = new Hip();
			hip.email = user.email;
			hip.password = user.password;
			hip.lat = user.lat;
			hip.lng = user.lng;
			hip.save(function(err) {
				if (err)
					callback(err);
				else
					callback(null);
			});
		},
		updateHip: function(user, callback) {
			var id = user.id;
			var hip = findHipById(id, function(err, doc) {
				if (err)
					callback(err);
				else {
					if (!doc) {
						callback({message: 'user not found'});
					} else {
						doc.lat = user.lat;
						doc.lng = user.lng;
						doc.save(function(err) {
							if (err)
								callback(err);
							else
								callback(null);
						});
					}
				}
			});
		},
		findHipByEmail: function (email, callback) {
			Hip.findOne({email: new RegExp('^' + email + '$', 'i')}, function(err, doc) {
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
		}
	}
})();