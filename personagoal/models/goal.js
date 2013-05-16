var mysql = require('./mysql');
var async = require('async');

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

exports.markGoalComplete = function(goal_id, user_id, callback) {
	var userOwnership = function(callback) {
		mysql.getConnection(function( connection ) {
			var params = [goal_id, user_id];
			connection.query('SELECT * FROM User_Goal WHERE goal_id = ? AND user_id = ?', params,
			function(err, result) {
				connection.end();
				if(err) return callback(err);
				else if(result.length == 0) return callback(true);
				else return callback(null);
			});
		});
	}
	var markComplete = function(callback) {
		mysql.getConnection(function( connection ) {
			var params = [new Date(), goal_id];
			connection.query('UPDATE Goal SET completed_timestamp = ? WHERE goal_id = ?', params,
			function(err, result) {
				connection.end();
				if(err) return callback(err);
				else return callback(null);
			});
		});
	}
	async.series([userOwnership, markComplete], function(err, res) {
		if(err) return callback(err, null);
		else return callback(null, true);
	});
}

exports.markGoalNotComplete = function(goal_id, user_id, callback) {
	var userOwnership = function(callback) {
		mysql.getConnection(function( connection ) {
			var params = [goal_id, user_id];
			connection.query('SELECT * FROM User_Goal WHERE goal_id = ? AND user_id = ?', params,
			function(err, result) {
				connection.end();
				if(err) return callback(err);
				else if(result.length == 0) return callback(true);
				else return callback(null);
			});
		});
	}
	var markNotComplete = function(callback) {
		mysql.getConnection(function( connection ) {
			var params = [goal_id];
			connection.query('UPDATE Goal SET completed_timestamp = NULL WHERE goal_id = ?', params,
			function(err, result) {
				connection.end();
				if(err) return callback(err);
				else return callback(null);
			});
		});
	}
	async.series([userOwnership, markNotComplete], function(err, res) {
		if(err) return callback(err, null);
		else return callback(null, true);
	});
}

exports.linkGoalToParent = function(goal_id, parent_id, callback) {
	mysql.getConnection(function( connection ) {
		var getParentID = function(callback) {
			if(parent_id != null) {
				connection.query('SELECT root FROM GoalTreeChildren WHERE child_id = ?', [parent_id], 
				function(err, result){
					if(err) return callback(err, null);
					else if(result.length === 0) return callback("No Parent in Tree");
					else return callback(null, result[0].root);
				});
			} else {
				parent_id = goal_id;
				return callback(null, goal_id);
			}
		}
		var performInsertion = function(root, callback) {
			params = [ parent_id, goal_id, root ];
			var query = connection.query('INSERT INTO GoalTreeChildren(goal_id, child_id, root) VALUES(?,?,?)', params,
			function(err, result) {
				if(err) return callback(err, null);
				else return callback(null, true);
			});
		}
		async.waterfall([getParentID, performInsertion], function(err, result) {
			connection.end();
			if(err) return callback(err, null);
			else return callback(null, true);
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