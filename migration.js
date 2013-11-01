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
				
			var windData = [{
				range: [7,16],
				phrases: [{en: 'Wind', ru: encodeURIComponent('Ветерок')}],
				tips: [{en: 'Be happy!', ru: encodeURIComponent('вcе будет зашибись')}]
			},{
				range: [17,33],
				phrases: [{en: 'Windy', ru: encodeURIComponent('Ветер')}],
				tips: [{en: 'grab the scarf', ru: encodeURIComponent('взять шарфик')}]
			},{
				range: [34, 10000],
				phrases: [{en: 'Strong wind! Be careful!', ru: encodeURIComponent('Сильный ветер, сдует нафиг!')}],
				tips: [{en: 'you\'d better stay at home', ru: encodeURIComponent('лучше отсидеться дома')}]
			}];
			
			windData.forEach(function (d) {
				db.addWindReference(d, function (err, doc) {
					if (err)
						console.log('Error occurred while migrating wind references: %j', err);
					else
						console.log('successfully added: %j', doc);
				});
			});
			
			return callback({ok: true, message: 'migration copmpleted successfully'});
		},
		migrateTempReferences: function(callback) {
			if (!db.isConnected)
				db.connect();
				
			var temps = [{
				range: [9,10000],
				phrases: [{en: 'It got really fucking hot', ru: encodeURIComponent('Охренительно потеплело')}],
				tips: [{en: ':)', ru: ':)'}]
			},{
				range: [5,8],
				phrases: [{en: 'Yeah, it got really warmer', ru: encodeURIComponent('Потеплело')}],
				tips: [{en: ':)', ru: ':)'}]
			},{
				range: [3,4],
				phrases: [{en: 'It got a little bit warmer', ru: encodeURIComponent('Чуть чуть потеплело')}],
				tips: [{en: ':)', ru: ':)'}]
			},{
				range: [-4,-3],
				phrases: [{en: 'It got colder', ru: encodeURIComponent('Чуть чуть похолодало')}],
				tips: [{en: ':(', ru: ':('}]
			},{
				range: [-8,-5],
				phrases: [{en: 'Uh, it\'s really getting cold', ru: encodeURIComponent('Похолодало')}],
				tips: [{en: ':(', ru: ':('}]
			},{
				range: [-10000,-9],
				phrases: [{en: 'It got fucking cold!!!', ru: encodeURIComponent('Охренительно похолодало')}],
				tips: [{en: ':(', ru: ':('}]
			}];
			
			temps.forEach(function (t) {
				db.addTempReference(t, function (err, temp) {
					if (err)
						console.log('Error occurred while migrating temperature references: %j', err);
					else 
						console.log('Temp referencess successfully saved: %j', temp);
				});
			});
			
			return callback({ok: true, message: 'migration copmpleted successfully'});
		},
		migrateCodes: function (callback) {
			if (!db.isConnected)
				db.connect();
		
			var codes = [{
				code: 395,
				description: 'Moderate or heavy snow in area with thunder',
				phrases: [{en: 'It\'s fucking heavy snowing', ru: encodeURIComponent('Валит снег')}],
				tips: [{en: 'Skiing! Yahoo!', ru: 'Взять санки'}]
			}, {
				code: 392,
				description: 'Patchy light snow in area with thunder',
				phrases: [{en: 'Patchy light snow in area with thunder', ru: encodeURIComponent('Местами небольшой снег')}],
				tips: [{en: 'Take a scarf', ru: 'Взять шарфик'}]
			}, {
				code: 389,
				description: 'Moderate or heavy rain in area with thunder',
				phrases: [{en: 'Moderate or heavy rain in area with thunder', ru: encodeURIComponent('Сильный дождь с молнией и громом')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик, не прятаться под дубом'}]
			}, {
				code: 386,
				description: 'Patchy light rain in area with thunder',
				phrases: [{en: 'Patchy light rain in area with thunder', ru: encodeURIComponent('Местами дождь с грозой')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик, не прятаться под дубом'}]			
			}, {
				code: 377,
				description: 'Moderate or heavy showers of ice pellets',				
				phrases: [{en: 'Moderate or heavy showers of ice pellets', ru: encodeURIComponent('Умеренные или сильные ливни ледяная крупа')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]	
			}, {
				code: 374,
				description: 'Light showers of ice pellets',
				phrases: [{en: 'Light showers of ice pellets', ru: encodeURIComponent('Небольшой ливень с градом')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]	
			}, {
				code: 371,
				description: 'Moderate or heavy snow showers',
				phrases: [{en: 'Moderate or heavy snow showers', ru: encodeURIComponent('Небольшой ливень с градом')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]	
			}, {
				code: 368,
				description: 'Light snow showers',
				phrases: [{en: 'Light snow showers', ru: encodeURIComponent('Небольшой снег')}],
				tips: [{en: 'Put on a scarf', ru: 'Одеть шарфик'}]	
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