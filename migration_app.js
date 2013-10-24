var m = require('./migration');

m.connect();

m.migrateCodes(function (msg) {
	console.log(msg);
});
/*
process.nextTick(function() {
	m.migrateWindReferences(function (rsp) {
		console.log(rsp);
	});
	process.nextTick(function() {
		m.migrateTempReferences(function (rsp) {
			console.log(rsp);
		});
	});
});*/


