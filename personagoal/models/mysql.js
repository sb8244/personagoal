var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'morewayo',
	database: 'personagoal'
});

exports.getConnection = function() {
	connection.connect();
	return connection;
}