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
				phrases: [{en: 'Moderate or heavy sleet showers', ru: encodeURIComponent('Умеренный или сильный дождь со снегом')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]	
			}, {
				code: 362,
				description: 'Light sleet showers',
				phrases: [{en: 'Light sleet showers', ru: encodeURIComponent('Light sleet showers')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]	
			}, {
				code: 359,
				description: 'Torrential rain shower',
				phrases: [{en: 'Torrential rain shower', ru: encodeURIComponent('Torrential rain shower')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]	
			}, {
				code: 356,
				description: 'Moderate or heavy rain shower',
				phrases: [{en: 'Moderate or heavy rain shower', ru: encodeURIComponent('Moderate or heavy rain shower')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]	
			}, {
				code: 353,
				description: 'Light rain shower',
				phrases: [{en: 'Light rain shower', ru: encodeURIComponent('Light rain shower')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]	
			}, {
				code: 350,
				description: 'Ice pellets',
				phrases: [{en: 'Ice pellets', ru: encodeURIComponent('Ice pellets')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]	
			}, {
				code: 338,
				description: 'Heavy snow',
				phrases: [{en: 'Heavy snow', ru: encodeURIComponent('Heavy snow')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]	
			}, {
				code: 335,
				description: 'Patchy heavy snow',
				phrases: [{en: 'Patchy heavy snow', ru: encodeURIComponent('Patchy heavy snow')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]	
			}, {
				code: 332,
				description: 'Moderate snow',
				phrases: [{en: 'Moderate snow', ru: encodeURIComponent('Moderate snow')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]
			}, {
				code: 329,
				description: 'Patchy moderate snow',
				phrases: [{en: 'Patchy moderate snow', ru: encodeURIComponent('Patchy moderate snow')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]
			}, {
				code: 326,
				description: 'Light snow',
				phrases: [{en: 'Light snow', ru: encodeURIComponent('Light snow')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]
			}, {
				code: 323,
				description: 'Patchy light snow',
				phrases: [{en: 'Patchy light snow', ru: encodeURIComponent('Patchy light snow')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]
			}, {
				code: 320,
				description: 'Moderate or heavy sleet',
				phrases: [{en: 'Moderate or heavy sleet', ru: encodeURIComponent('Moderate or heavy sleet')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]
			}, {
				code: 317,
				description: 'Light sleet',
				phrases: [{en: 'Light sleet', ru: encodeURIComponent('Light sleet')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]
			}, {
				code: 314,
				description: 'Moderate or Heavy freezing rain',
				phrases: [{en: 'Moderate or Heavy freezing rain', ru: encodeURIComponent('Moderate or Heavy freezing rain')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]
			}, {
				code: 311,
				description: 'Light freezing rain',
				phrases: [{en: 'Light freezing rain', ru: encodeURIComponent('Light freezing rain')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]
			}, {
				code: 308,
				description: 'Heavy rain',
				phrases: [{en: 'Heavy rain', ru: encodeURIComponent('Heavy rain')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]
			}, {
				code: 305,
				description: 'Heavy rain at times',
				phrases: [{en: 'Heavy rain at times', ru: encodeURIComponent('Heavy rain at times')}],
				tips: [{en: 'Get an umbrella', ru: 'Взять зонтик'}]
			}, {
				code: 302,
				description: 'Moderate rain',
				phrases: [{en: 'Moderate rain', ru: encodeURIComponent('Moderate rain')}],
				tips: [{en: 'Moderate rain', ru: 'Moderate rain'}]
			}, {
				code: 299,
				description: 'Moderate rain at times',
				phrases: [{en: 'Moderate rain at times', ru: encodeURIComponent('Moderate rain at times')}],
				tips: [{en: 'Moderate rain', ru: 'Moderate rain'}]
			}, {
				code: 296,
				description: 'Light rain',
				phrases: [{en: 'Light rain', ru: encodeURIComponent('Light rain')}],
				tips: [{en: 'Moderate rain', ru: 'Moderate rain'}]
			}, {
				code: 293,
				description: 'Patchy light rain',
				phrases: [{en: 'Patchy light rain', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 284,
				description: 'Heavy freezing drizzle',
				phrases: [{en: 'Heavy freezing drizzle', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 281,
				description: 'Freezing drizzle',
				phrases: [{en: 'Freezing drizzle', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 266,
				description: 'Light drizzle',
				phrases: [{en: 'Light drizzle', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 263,
				description: 'Patchy light drizzle',
				phrases: [{en: 'Patchy light drizzle', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 260,
				description: 'Freezing fog',
				phrases: [{en: 'Freezing fog', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 248,
				description: 'Fog',
				phrases: [{en: 'Fog', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 230,
				description: 'Blizzard',
				phrases: [{en: 'Blizzard', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 227,
				description: 'Blowing snow',
				phrases: [{en: 'Blowing snow', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 200,
				description: 'Thundery outbreaks in nearby',
				phrases: [{en: 'Thundery outbreaks in nearby', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 185,
				description: 'Patchy freezing drizzle nearby',
				phrases: [{en: 'Patchy freezing drizzle nearby', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 182,
				description: 'Patchy sleet nearby',
				phrases: [{en: 'Patchy sleet nearby', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 179,
				description: 'Patchy snow nearby',
				phrases: [{en: 'Patchy snow nearby', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 176,
				description: 'Patchy rain nearby',
				phrases: [{en: 'Patchy snow nearby', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 143,
				description: 'Mist',
				phrases: [{en: 'Mist', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 122,
				description: 'Overcast',
				phrases: [{en: 'Overcast', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 119,
				description: 'Cloudy',
				phrases: [{en: 'Cloudy', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 116,
				description: 'Partly Cloudy',
				phrases: [{en: 'Partly Cloudy', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
			}, {
				code: 113,
				description: 'Clear/Sunny',
				phrases: [{en: 'Clear/Sunny', ru: encodeURIComponent('здесь будет перевод')}],
				tips: [{en: 'Tip goes here', ru: 'типсы будут здесь'}]
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