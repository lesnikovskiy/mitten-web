// to run tests once
// $ jasmine-node spec/ 
// to run tests continuously
// $ jasmine-node --autotest spec/
var app = require('../app');
// https://npmjs.org/package/supertest
var request = require('supertest');

describe('app.js tests', function() {
	describe('GET /', function() {
		it('should return root page', function(done) {
			request(app)
				.get('/')
				.expect(200, done);
		});
	});

	describe('GET /api/weather', function() {
		it('should respond with JSON', function (done) {
			request(app)
				.get('/api/weather')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});
	
	describe('GET /api/hip', function() {
		it('should return collection of json users', function(done) {
			request(app)
				.get('/api/hip')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});
	
	describe('POST /api/logout', function() {
		it('should successfully logout', function(done) {
			request(app)
				.post('/api/logout')
				.set('Cookie:', 'MITTENAUTH=9878468465')
				.expect(200, done);	
		});
	});
});