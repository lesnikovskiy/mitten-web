var util = require('util');
var notesdb = require('./mongo');

notesdb.connect(function(err) {
	if (err)
		throw err;
});

notesdb.add('Olga', 'If yesterday was a rain, grab umbrella today', function (err) {
	if (err)
		util.log('ERROR' + err);
});

notesdb.forAll(function (err, row) {
	util.log('ROW: ' + util.inspect(row));
}, function (err) {
	if (err)
		throw err;
		
	util.log('ALL DONE');
	notesdb.disconnect();
});