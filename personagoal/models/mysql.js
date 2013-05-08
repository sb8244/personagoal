var mysql = require('mysql');
var config = require('./config');

config.getConfiguration(function(data) {
	var databaseName = 'personagoal';
	if(global.testing === true)
		databaseName = 'personagoal-test';
	console.log(databaseName);
	pool  = mysql.createPool({
		host     : data.host,
		user     : data.user,
		password : data.password,
		database : databaseName
	});
});


exports.getConnection = function(callback) {
	pool.getConnection(function(err, connection) {
		if(err == null) {
			return callback(connection);
		} else {
			throw new Error(err);
		}
	});
}