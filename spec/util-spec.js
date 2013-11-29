// to run tests once
// $ jasmine-node spec/ 
// to run tests continuously
// $ jasmine-node --autotest spec/
var util = require('../util');

describe('util module tests', function() {
	var temp;
	var humidity;
	beforeEach(function() {
		temp = 10;
		humidity = 50;
	});
	it('should return correct humidex', function() {
		var humidex = util.getHumidex(temp, humidity);
		expect(humidex).toBe(9);
	});
	it('should return correct dew point', function() {
		var dewPoint = util.getDewPoint(temp, humidity);
		expect(dewPoint).toBe(0);
	});
	it('should return correct wind chill', function() {
		var windChill = util.getWindChill(temp, humidity);
		expect(windChill).toBe(-2);
	});
});