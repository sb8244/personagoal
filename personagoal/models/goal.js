var MySQL = require('./mysql').MySQL;

var GoalProvider = function(useTestDB) {
	mysql = new MySQL(useTestDB);
}

GoalProvider.prototype.createGoal = function(due_date, task_id, callback) {
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
				callback({goal: "duplicate"}, null);
			} else if( err ) {
				callback ( err , null);
			} else {
				callback(null, result.insertId);
			}
		});
	});
}

GoalProvider.prototype.linkUserToGoal = function(user_id, goal_id, callback) {
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
				callback({msg: "duplicate"}, null);
			} else if( err ) {
				callback ( err , null);
			} else {
				callback(null, true);
			}
		});
	});
}

exports.GoalProvider = GoalProvider;