function getWeather() {
	$.ajax({
		type: 'GET',
		cache: false,
		url: '/api/weather/current',
		success: function(data) {
			$('#weather').html('');
		
			if (!data.ok) {
				$('#weather').html(data.message);
			} else {
				var w = data.data[0];
				if (!w)
					return;
				
				$('#weather').append($('<p />', {text: 'Observation time: ' + new Date(w.observation_time).toString()}));
				$('#weather').append($('<p />', {text: 'Wind direction: ' + w.winddirection}));
				$('#weather').append($('<p />', {text: 'Wind speed: ' + w.windspeedKmph + ' KM/PH'}));
				$('#weather').append($('<p />', {text: 'Pressure: ' + w.pressure + 'mm'}));
				$('#weather').append($('<p />', {text: 'Temperature: ' + w.tempC}));				
				$('#weather').append($('<p />', {text: 'Humidity: ' + w.humidity + '%'}));
				$('#weather').append($('<p />', {text: 'Cloudcover: ' + w.cloudcover}));
				$('#weather').append($('<p />', {text: 'Visibility: ' + w.visibility}));
				$('#weather').append($('<p />', {text: 'Weather desc: ' + w.weatherDesc[0]}));
			}
		}
	});
}

$(function() {
	getWeather();
	setInterval(getWeather, 60*1000);
});