var m = require('./migration');

m.migrateWindReferences(function (rsp) {
	console.log(rsp);
});

m.migrateTempReferences(function (rsp) {
	console.log(rsp);
});