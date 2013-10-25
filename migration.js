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
				phraseRU: encodeURIComponent('Ветерок')
			}, function (err, w) {
				if (err)
					console.log(err);
				else
					console.log('saved: %j', w);
					
				db.addWindReference({
					range: [17,33],
					phraseEN: 'Windy',
					phraseRU: encodeURIComponent('Ветер')
				}, function (err, w) {
					if (err)
						console.log(err);
					else
						console.log('saved: %j', w);
						
					db.addWindReference({
						range: [34, 10000],
						phraseEN: 'Strong wind! Be careful!',
						phraseRU: encodeURIComponent('Сильный ветер, сдует нафиг!')
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
				phraseRU: encodeURIComponent('Охренительно потеплело')
			}, function (err, t) {
				if (err)
					console.log(err);
					
				db.addTempReference({
					range: [5,8],
					phraseEN: 'Yeah, it got really warmer',
					phraseRU: encodeURIComponent('Потеплело')
				}, function (err, t) {
					if (err)
						console.log(err);
						
					db.addTempReference({
						range: [3,4],
						phraseEN: 'It got a little bit warmer',
						phraseRU: encodeURIComponent('Чуть чуть потеплело')
					}, function (err, t) {
						if (err)
							console.log(err);
							
						db.addTempReference({
							range: [-4,-3],
							phraseEN: 'It got colder',
							phraseRU: encodeURIComponent('Чуть чуть похолодало')
						}, function (err, t) {
							if (err)
								console.log(err);
								
							db.addTempReference({
								range: [-8,-5],
								phraseEN: 'Uh, it\'s really getting cold',
								phraseRU: encodeURIComponent('Похолодало')
							}, function (err, t) {
								if (err)
									console.log(err);
									
								db.addTempReference({
									range: [-10000,-9],
									phraseEN: 'It got fucking cold!!!',
									phraseRU: encodeURIComponent('Охренительно похолодало')
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
			}, {
				code: 389,
				description: 'Moderate or heavy rain in area with thunder',
				phraseEN: 'Moderate or heavy rain in area with thunder',
				phraseRU: encodeURIComponent('Moderate or heavy rain in area with thunder')
			}, {
				code: 386,
				description: 'Patchy light rain in area with thunder',
				phraseEN: 'Patchy light rain in area with thunder',
				phraseRU: encodeURIComponent('Patchy light rain in area with thunder')
			}, {
				code: 377,
				description: 'Moderate or heavy showers of ice pellets',
				phraseEN: 'Moderate or heavy showers of ice pellets',
				phraseRU: encodeURIComponent('Moderate or heavy showers of ice pellets')
			}, {
				code: 374,
				description: 'Light showers of ice pellets',
				phraseEN: 'Light showers of ice pellets',
				phraseRU: encodeURIComponent('Light showers of ice pellets')
			}, {
				code: 371,
				description: 'Moderate or heavy snow showers',
				phraseEN: 'Moderate or heavy snow showers',
				phraseRU: encodeURIComponent('Moderate or heavy snow showers')
			}, {
				code: 368,
				description: 'Light snow showers',
				phraseEN: 'Light snow showers',
				phraseRU: encodeURIComponent('Light snow showers')
			}, {
				code: 365,
				description: 'Moderate or heavy sleet showers',
				phraseEN: 'Moderate or heavy sleet showers',
				phraseRU: encodeURIComponent('Moderate or heavy sleet showers')
			}, {
				code: 362,
				description: 'Light sleet showers',
				phraseEN: 'Light sleet showers',
				phraseRU: encodeURIComponent('Light sleet showers')
			}, {
				code: 359,
				description: 'Torrential rain shower',
				phraseEN: 'Torrential rain shower',
				phraseRU: encodeURIComponent('Torrential rain shower')
			}, {
				code: 356,
				description: 'Moderate or heavy rain shower',
				phraseEN: 'Moderate or heavy rain shower',
				phraseRU: encodeURIComponent('Moderate or heavy rain shower')
			}, {
				code: 353,
				description: 'Light rain shower',
				phraseEN: 'Light rain shower',
				phraseRU: encodeURIComponent('Light rain shower')
			}, {
				code: 350,
				description: 'Ice pellets',
				phraseEN: 'Ice pellets',
				phraseRU: encodeURIComponent('Ice pellets')
			}, {
				code: 338,
				description: 'Heavy snow',
				phraseEN: 'Heavy snow',
				phraseRU: encodeURIComponent('Heavy snow')
			}, {
				code: 335,
				description: 'Patchy heavy snow',
				phraseEN: 'Patchy heavy snow',
				phraseRU: encodeURIComponent('Patchy heavy snow')
			}, {
				code: 332,
				description: 'Moderate snow',
				phraseEN: 'Moderate snow',
				phraseRU: encodeURIComponent('Moderate snow')
			}, {
				code: 329,
				description: 'Patchy moderate snow',
				phraseEN: 'Patchy moderate snow',
				phraseRU: encodeURIComponent('Patchy moderate snow')
			}, {
				code: 326,
				description: 'Light snow',
				phraseEN: 'Light snow',
				phraseRU: encodeURIComponent('Light snow')
			}, {
				code: 323,
				description: 'Patchy light snow',
				phraseEN: 'Patchy light snow',
				phraseRU: encodeURIComponent('Patchy light snow')
			}, {
				code: 320,
				description: 'Moderate or heavy sleet',
				phraseEN: 'Moderate or heavy sleet',
				phraseRU: encodeURIComponent('Moderate or heavy sleet')
			}, {
				code: 317,
				description: 'Light sleet',
				phraseEN: 'Light sleet',
				phraseRU: encodeURIComponent('Light sleet')
			}, {
				code: 314,
				description: 'Moderate or Heavy freezing rain',
				phraseEN: 'Moderate or Heavy freezing rain',
				phraseRU: encodeURIComponent('Moderate or Heavy freezing rain')
			}, {
				code: 311,
				description: 'Light freezing rain',
				phraseEN: 'Light freezing rain',
				phraseRU: encodeURIComponent('Light freezing rain')
			}, {
				code: 308,
				description: 'Heavy rain',
				phraseEN: 'Heavy rain',
				phraseRU: encodeURIComponent('Heavy rain')
			}, {
				code: 305,
				description: 'Heavy rain at times',
				phraseEN: 'Heavy rain at times',
				phraseRU: encodeURIComponent('Heavy rain at times')
			}, {
				code: 302,
				description: 'Moderate rain',
				phraseEN: 'Moderate rain',
				phraseRU: encodeURIComponent('Moderate rain')
			}, {
				code: 299,
				description: 'Moderate rain at times',
				phraseEN: 'Moderate rain at times',
				phraseRU: encodeURIComponent('Moderate rain at times')
			}, {
				code: 296,
				description: 'Light rain',
				phraseEN: 'Light rain',
				phraseRU: encodeURIComponent('Light rain')
			}, {
				code: 293,
				description: 'Patchy light rain',
				phraseEN: 'Patchy light rain',
				phraseRU: encodeURIComponent('Patchy light rain')
			}, {
				code: 284,
				description: 'Heavy freezing drizzle',
				phraseEN: 'Heavy freezing drizzle',
				phraseRU: encodeURIComponent('Heavy freezing drizzle')
			}, {
				code: 281,
				description: 'Freezing drizzle',
				phraseEN: 'Freezing drizzle',
				phraseRU: encodeURIComponent('Freezing drizzle')
			}, {
				code: 266,
				description: 'Light drizzle',
				phraseEN: 'Light drizzle',
				phraseRU: encodeURIComponent('Light drizzle')
			}, {
				code: 263,
				description: 'Patchy light drizzle',
				phraseEN: 'Patchy light drizzle',
				phraseRU: encodeURIComponent('Patchy light drizzle')
			}, {
				code: 260,
				description: 'Freezing fog',
				phraseEN: 'Freezing fog',
				phraseRU: encodeURIComponent('Freezing fog')
			}, {
				code: 248,
				description: 'Fog',
				phraseEN: 'Fog',
				phraseRU: encodeURIComponent('Fog')
			}, {
				code: 230,
				description: 'Blizzard',
				phraseEN: 'Blizzard',
				phraseRU: encodeURIComponent('Blizzard')
			}, {
				code: 227,
				description: 'Blowing snow',
				phraseEN: 'Blowing snow',
				phraseRU: encodeURIComponent('Blowing snow')
			}, {
				code: 200,
				description: 'Thundery outbreaks in nearby',
				phraseEN: 'Thundery outbreaks in nearby',
				phraseRU: encodeURIComponent('Thundery outbreaks in nearby')
			}, {
				code: 185,
				description: 'Patchy freezing drizzle nearby',
				phraseEN: 'Patchy freezing drizzle nearby',
				phraseRU: encodeURIComponent('Patchy freezing drizzle nearby')
			}, {
				code: 182,
				description: 'Patchy sleet nearby',
				phraseEN: 'Patchy sleet nearby',
				phraseRU: encodeURIComponent('Patchy sleet nearby')
			}, {
				code: 179,
				description: 'Patchy snow nearby',
				phraseEN: 'Patchy snow nearby',
				phraseRU: encodeURIComponent('Patchy snow nearby')
			}, {
				code: 176,
				description: 'Patchy rain nearby',
				phraseEN: 'Patchy rain nearby',
				phraseRU: encodeURIComponent('Patchy rain nearby')
			}, {
				code: 143,
				description: 'Mist',
				phraseEN: 'Mist',
				phraseRU: encodeURIComponent('Mist')
			}, {
				code: 122,
				description: 'Overcast',
				phraseEN: 'Overcast',
				phraseRU: encodeURIComponent('Overcast')
			}, {
				code: 119,
				description: 'Cloudy',
				phraseEN: 'Cloudy',
				phraseRU: encodeURIComponent('Cloudy')
			}, {
				code: 116,
				description: 'Partly Cloudy',
				phraseEN: 'Partly Cloudy',
				phraseRU: encodeURIComponent('Partly Cloudy')
			}, {
				code: 113,
				description: 'Clear/Sunny',
				phraseEN: 'Clear/Sunny',
				phraseRU: encodeURIComponent('Clear/Sunny')
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