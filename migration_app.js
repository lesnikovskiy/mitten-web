var m = require('./migration');

m.connect();

m.migrateCodes(function (msg) {
	console.log(msg);
});

m.migrateWindReferences(function (rsp) {
	console.log(rsp);
});

m.migrateTempReferences(function (rsp) {
	console.log(rsp);
});