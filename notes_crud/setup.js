var util = require('util');
var async = require('async');
var notesdb = require('./mongo');

notesdb.connect = function(err) {
	if (err)
		throw err;	
};

notesdb.setup(function (err) {
	if (err) {
		util.log('ERROR ' + err);
		throw err;
	}
	
	async.series([
		function (cb) {
			notesdb.add('Lorem Ipsum ', 'Cras metus', function (err) {
				if (err) {
					util.log('ERROR ' + err);
					cb(err);
				}
			});
		}
	], function (err, results) {
		if (err) {
			util.log('ERROR ' + error);
			notesdb.disconnect(function(err) {});
		}			
	});
});