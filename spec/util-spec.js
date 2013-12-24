// to run tests once
// $ jasmine-node spec/ 
// to run tests continuously
// $ jasmine-node --autotest spec/
var util = require('../util');

describe('util module tests', function() {
	var temp;
	var temp2;
	var minusTemp;
	var humidity;
	var speedKmph;
	
	beforeEach(function() {
		temp = 10;
		temp2 = 20;
		minusTemp = -2;
		humidity = 50;
		speedKmph = 23;
	});
	it('should return correct humidex', function() {
		var humidex = util.getHumidex(4, 81);
		expect(humidex).toBe(3);
	});
	it('should return correct dew point', function() {
		var dewPoint = util.getDewPoint(temp2, humidity);
		expect(dewPoint).toBe(9);
	});
	it('should return correct wind chill', function() {
		var windChill = util.getWindChill(minusTemp, speedKmph);
		expect(windChill).toBe(-13);
	});
});