var mysql = require('./mysql');


exports.createGoal = function(due_date, task_id, callback) {
	var params = [
		due_date,
		task_id
	];
	mysql.getConnection(function( connection ) {
		connection.query('INSERT INTO Goal(due_date, task_id) VALUES(?, ?)', params,
		function(err, result) {
			connection.end();
			//If there was a duplicate entry, alert the callback
			if(err && err.code == 'ER_DUP_ENTRY') {
				return callback({goal: "duplicate"}, null);
			} else if( err ) {
				return callback ( err , null);
			} else {
				return callback(null, result.insertId);
			}
		});
	});
}

exports.linkUserToGoal = function(user_id, goal_id, callback) {
	var params = [
		user_id,
		goal_id
	];
	mysql.getConnection(function( connection ) {
		connection.query('INSERT INTO User_Goal VALUES(?, ?)', params,
		function(err, result) {
			connection.end();
			//If there was a duplicate entry, alert the callback
			if(err && err.code == 'ER_DUP_ENTRY') {
				return callback({msg: "duplicate"}, null);
			} else if( err ) {
				return callback ( err , null);
			} else {
				return callback(null, true);
			}
		});
	});
}