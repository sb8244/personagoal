var mysql = require('mysql');
var config = require('./config');

var MySQL = function(useTestDB) {
	config.getConfiguration(function(data) {
		var databaseName = 'personagoal';
		if(useTestDB === true)
			databaseName = 'personagoal-test';
		connection = mysql.createConnection({
			host: data.host
			user: data.user
			password: data.password
			database: databaseName
		});
	});
}


MySQL.prototype.getConnection = function() {
	connection.connect();
	return connection;
}

exports.MySQL = MySQL;