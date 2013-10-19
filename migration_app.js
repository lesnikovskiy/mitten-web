var m = require('./migration');

console.log('migration_app.js launched');

m.migrateWindReferences(function (rsp) {
	console.log(rsp);
});

m.migrateTempReferences(function (rsp) {
	console.log(rsp);
});