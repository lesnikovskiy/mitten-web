var util = require('util');
var db = require('./data');

module.exports = (function() {
	return {
		connect: function() {
			db.connect();
		},
		migrateWindReferences: function(callback) {
			if (!db.isConnected)
				db.connect();
		
			db.addWindReference({
				range: [7,16],
				phraseEN: 'Wind',
				phraseRU: 'Ветерок'
			}, function (err, w) {
				if (err)
					console.log(err);
				else
					console.log('saved: %j', w);
					
				db.addWindReference({
					range: [17,33],
					phraseEN: 'Windy',
					phraseRU: 'Ветер'
				}, function (err, w) {
					if (err)
						console.log(err);
					else
						console.log('saved: %j', w);
						
					db.addWindReference({
						range: [34, 10000],
						phraseEN: 'Strong wind! Be careful!',
						phraseRU: 'Сильный ветер, сдует нафиг!'
					}, function (err, w) {
						if (err)
							console.log(err);
						else
							console.log('saved: %j', w);
							
						return callback({ok: true, message: 'migration copmpleted successfully'});
					});
				});
			});
		},
		migrateTempReferences: function(callback) {
			if (!db.isConnected)
				db.connect();
				
			db.addTempReference({
				range: [9,10000],
				phraseEN: 'It got really fucking hot',
				phraseRU: 'Охренительно потеплело'
			}, function (err, t) {
				if (err)
					console.log(err);
					
				db.addTempReference({
					range: [5,8],
					phraseEN: 'Yeah, it got really warmer',
					phraseRU: 'Потеплело'
				}, function (err, t) {
					if (err)
						console.log(err);
						
					db.addTempReference({
						range: [3,4],
						phraseEN: 'It got a little bit warmer',
						phraseRU: 'Чуть чуть потеплело'
					}, function (err, t) {
						if (err)
							console.log(err);
							
						db.addTempReference({
							range: [-4,-3],
							phraseEN: 'It got colder',
							phraseRU: 'Чуть чуть похолодало'
						}, function (err, t) {
							if (err)
								console.log(err);
								
							db.addTempReference({
								range: [-8,-5],
								phraseEN: 'Uh, it\'s really getting cold',
								phraseRU: 'Похолодало'
							}, function (err, t) {
								if (err)
									console.log(err);
									
								db.addTempReference({
									range: [-10000,-9],
									phraseEN: 'It got fucking cold!!!',
									phraseRU: 'Охренительно похолодало'
								}, function (err, t) {
									if (err)
										console.log(err);
										
									return callback({ok: true, message: 'migration copmpleted successfully'});
								});
							});
						});
					});
				});
			});
		},
		migrateCodes: function (callback) {
			var codes = [{
				code: 395,
				description: 'Moderate or heavy snow in area with thunder',
				phraseEN: 'It\'s fucking heavy snowing',
				phraseRU: encodeURIComponent('Валит снег')
			}, {
				code: 392,
				description: 'Patchy light snow in area with thunder',
				phraseEN: 'It\'s fucking heavy snowing',
				phraseRU: encodeURIComponent('Валит снег')
			}];
			
			codes.forEach(function (code) {
				db.addWeatherCode(code, function(err, doc) {
					if (err)
						console.log('Error occurred during migration: %j', err);
					else
						console.log('Added code doc: %j', doc);
				});
			});
			
			callback('Migration completed');
		}
	};
})();