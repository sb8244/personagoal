var mysql = require('mysql');

var MySQL = function(useTestDB) {
	var databaseName = 'personagoal';
	if(useTestDB === true)
		databaseName = 'personagoal-test';
	connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'morewayo',
		database: databaseName
	});
}


MySQL.prototype.getConnection = function() {
	connection.connect();
	return connection;
}

exports.MySQL = MySQL;