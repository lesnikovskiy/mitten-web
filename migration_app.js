var m = require('./migration');

m.connect();

m.migrateWindReferences(function (rsp) {
	console.log(rsp);
});

m.migrateTempReferences(function (rsp) {
	console.log(rsp);
});

m.migrateCodes(function (msg) {
	console.log(msg);
});