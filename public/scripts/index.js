var intId = null;
var intTime = 1000 * 60;

function getWeather() {
	$.ajax({
		type: 'GET',
		cache: false,
		url: '/api/weather/comparable',
		success: function(data) {
			$('#weather').html('');
		
			if (!data.ok) {
				clearInterval(indId);
				intId = null;
				
				if (data.type === 'unauthorized') {
					$('#weather-content, #register-content').hide();
					$(':input').val('');
					$('#login-content').find('.error-message').html('');
					$('#login-content').show();
				} else {
					if (data.error && data.error.message) {
						$('#weather-content').find('.error-message').html(data.error.message);
					}
				}
			} else {	
				var w = data.data.current_condition;
				if (!w)
					return;
					
				$('#login-content, #register-content').hide();
				$('#weather-content').fadeIn();
						
				$('#weather').append($('<li />', {text: 'Weather conditions', 'data-role': 'list-divider', role: 'heading'}));		
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
				
				var tempDiff = data.data.tempDiff;				
				if (tempDiff) {
					$('#weather').append($('<li />', {text: 'Weather comparison', 'data-role': 'list-divider', role: 'heading'}));
					$('#weather').append($('<li />', {text: tempDiff.phrase || ''}));		
				}
			}
		}
	});
}

$(function() {
	if (!navigator.geolocation) {
		$('#page').hide();
		$('#notsupported').show();
	}
	
	$('#btnLogin').on('click', function() {
		$('.error-message').html('');
		$.ajax({
			type: 'POST',
			url: '/api/login',
			cache: false,
			data: {
				email: $('#login-email').val(), 
				password: $('#login-password').val()
			},
			dataType: 'json',
			success: function(response) {
				if (response && response.ok) {
					getWeather();
					indId = setInterval(getWeather, intTime);
				} else {
					$('#login-content').find('.error-message').html(response.error.message);
				}
			},
			error: function(xhr, status, error) {
				$('#login-content').find('.error-message').html(error.message);
			}
		});
	});
	
	$('#btnGoToRegister').on('click', function() {
		$('.error-message').html('');
		$('#weather-content, #login-content').hide();
		$(':input').val('');
		$('#register-content').fadeIn();
	});
	
	$('#btnRegister').click(function() {	
		$('.error-message').html('');
		$.mobile.loading('show');
		
		navigator.geolocation.getCurrentPosition(function (pos) {
			if (pos.coords) {
				var lat = pos.coords.latitude;
				var lng = pos.coords.longitude;
				$.ajax({
					type: 'POST',
					url: '/api/hip',
					cache: false,
					data: {email: $('#reg-email').val(), password: $('#reg-password').val(), location: { lat: lat, lng: lng}},
					dataType: 'json',
					success: function(data) {	
						if (data.ok) {
							getWeather();
							indId = setInterval(getWeather, intTime);
						} else {
							if (data.error && data.error.message) {
								$('#register-content').find('.error-message').html(data.error.message);								
							}
						}
					},
					error: function(xhr, status, error) {
						$('#register-content').find('.error-message').html(error.message);
					},
					complete: function() {
						$.mobile.loading('hide');
					}
				});
			} else {
				$('#register-content').find('.error-message').html('Coordinates not found');
			}
		}, function (err) {
			switch (err.code) {
				case 0:
					$('#register-content').find('.error-message')
						.html('There was an error while retrieving your location: ' + err.message);
					$.mobile.loading('hide');
					break;
				case 1:
					$('#register-content').find('.error-message')
						.html('The location is turned off. Please turn on location in your browser settings. Error details: ");' + err.message);
					$.mobile.loading('hide');
					break;
				case 3:
					$('#register-content').find('.error-message')
						.html('The browser timed out before retrieving the location.');
					$.mobile.loading('hide');
					break;
				default:
					$('#register-content').find('.error-message')
						.html('Unknown geolocation error.');
					$.mobile.loading('hide');
					break;
			}
		});			
	});
	
	$('#logout').on('click', function() {
		$.post('/api/logout', {}, function (data) {
			getWeather();
		});
	});
	
	getWeather();
	indId = setInterval(getWeather, intTime);	
});