var mysql = require('mysql');
var config = require('./config');

var MySQL = function() {
	config.getConfiguration(function(data) {
		var databaseName = 'personagoal';
		if(global.testing === true)
			databaseName = 'personagoal-test';
		pool  = mysql.createPool({
			host     : data.host,
			user     : data.user,
			password : data.password,
			database : databaseName
		});
	});
}


MySQL.prototype.getConnection = function(callback) {
	pool.getConnection(function(err, connection) {
		if(err == null) {
			callback(connection);
		} else {
			throw new Error(err);
		}
	});
}

exports.MySQL = MySQL;