var util = require('util');
var path = require('path');
var express = require('express');
var app = module.exports = express();
var engine = require('ejs-locals');
var http = require('http');
var url = require('url');

var notesdb = require('./mongo');

app.configure(function() {
	app.engine('ejs', engine);
		
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, '/views'));
	app.set('view engine', 'ejs');
	
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, '/public')));
	app.use(app.router);
	app.use(express.errorHandler({
		dumpExceptions: true, showStack: true
	}));
});

var parseUrlParams = function (req, res, next) {
	req.urlP = url.parse(req.url, true);
	next();
};

notesdb.connect(function(err) {
	if (err) throw err;
});

app.on('close', function(err) {
	notesdb.disconnect(function(err) {});
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express Notes App is listening at port: ' + app.get('port'));
});