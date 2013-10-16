function getWeather() {
	$.ajax({
		type: 'GET',
		cache: false,
		url: '/api/weather/current',
		success: function(data) {
			$('#weather').html('');
		
			if (!data.ok) {
				$('#weather').append($('<li />', {text: 'Error: ' + data.message}));
			} else {
				var w = data.data[0];
				if (!w)
					return;
												
				$('#weather').append($('<li />', {text: 'Observation time: ' + new Date(w.observation_time).toString()}));
				$('#weather').append($('<li />', {text: 'Wind direction: ' + w.winddirection}));
				$('#weather').append($('<li />', {text: 'Wind speed: ' + w.windspeedKmph + ' KM/PH'}));
				$('#weather').append($('<li />', {text: 'Pressure: ' + w.pressure + 'mm'}));
				$('#weather').append($('<li />', {text: 'Temperature: ' + w.tempC}));				
				$('#weather').append($('<li />', {text: 'Humidity: ' + w.humidity + '%'}));
				$('#weather').append($('<li />', {text: 'Cloudcover: ' + w.cloudcover}));
				$('#weather').append($('<li />', {text: 'Visibility: ' + w.visibility}));
				$('#weather').append($('<li />', {text: 'Weather desc: ' + w.weatherDesc[0]}));
				$('#weather').append($('<li />', {text: 'Humidex: ' + w.humidex || '-'}));
				$('#weather').append($('<li />', {text: 'Dew Point: ' + w.dewPoint || '-'}));
				$('#weather').append($('<li />', {text: 'Wind chill factor: ' + w.windChill || '-'}));
			}
		}
	});
}

$(function() {
	getWeather();
	setInterval(getWeather, 60*1000);
});