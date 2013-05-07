var mysql = require('./mysql');

/*
 * Insert into the Task table (title, description) and callback with the insertion id
 */
 exports.createTask = function(data, callback) {
	var taskInsertParams = [
		data.title,
		data.description
	];
	mysql.getConnection(function( connection ) {
		connection.query('INSERT INTO Task(title, description) VALUES(?, ?)', taskInsertParams,
		function(err, result) {
			connection.end();
			//If there was a duplicate entry, alert the callback
			if(err && err.code == 'ER_DUP_ENTRY') {
				return callback({task: "duplicate"}, null);
			} else if( err ) {
				return callback ( err , null);
			} else {
				return callback(null, result.insertId);
			}
		});
	});
}
