var goalProvider = require("./goal");
var mysql = require('./mysql');
exports.insert = {
	goalInsert: function(test) {
		test.expect(2);
		var task_id = 0;
		var due_date = new Date();
		goalProvider.createGoal(due_date, task_id, function(err, result) {
			test.equals(err, null, "Error should be null");
			test.notEqual(result, null, "Result should not be null");
			mysql.getConnection(function( connection ) {
				connection.query('DELETE FROM Goal WHERE goal_id = ?', [result], function(err, result) {
					connection.end();
					test.done();
				});
			});
		});
	},

	goalLinkUser: function(test) {
		test.expect(2);
		//these are constants in the test database and should not be deleted
		var user_id = 1;
		var goal_id = 0;
		goalProvider.linkUserToGoal(user_id, goal_id, function(err, result) {
			test.equals(result, true, "Result should be true");
			test.equals(err, null, "Err should be null");
			mysql.getConnection(function( connection ) {
				connection.query('DELETE FROM User_Goal WHERE user_id = ? AND goal_id = ?', [user_id, goal_id], 
				function() {
					connection.end();
					test.done();
				});
			});
		});
	},

	goalLinkUserDuplicate: function(test) {
		test.expect(4);
		//these are constants in the test database and should not be deleted
		var user_id = 1;
		var goal_id = 0;
		goalProvider.linkUserToGoal(user_id, goal_id, function(err, result) {
			test.equals(result, true, "Result should be true");
			goalProvider.linkUserToGoal(user_id, goal_id, function(errInner, resultInner) {
				test.equals(resultInner, false, "Result should be false");
				test.equals(errInner.msg, "duplicate", "Error.msg should be duplicate");
				test.notEqual(errInner, null, "Err should not be null");
				mysql.getConnection(function( connection ) {
					connection.query('DELETE FROM User_Goal WHERE user_id = ? AND goal_id = ?', [user_id, goal_id], 
					function() {
						connection.end();
						test.done();
					});
				});
			});
		});
	}
};

exports.goaltree = {
	linkParent: function(test) {
		goalProvider.linkGoalToParent(4, 1, function(err, result) {
			test.expect(5);
			test.equals(err, null);
			test.equals(result, true);
			mysql.getConnection(function( connection ) {
				params = [ 1, 4, 1 ];
				connection.query('SELECT * FROM GoalTreeChildren WHERE goal_id = ? AND child_id = ? AND root = ?', params,
				function(err, result) {
					test.equals(err, null);
					test.equals(result.length, 1);
					connection.query('DELETE FROM GoalTreeChildren WHERE goal_id = ? AND child_id = ? AND root = ?', params,
					function(err2, result2) {;
						test.equals(err, null);
						connection.end();
						test.done();
					});
				});
			});
		});
	}, 

	linkNoParent: function(test) {
		goalProvider.linkGoalToParent(4, null, function(err, result) {
			test.expect(5);
			test.equals(err, null);
			test.equals(result, true);
			mysql.getConnection(function( connection ) {
				params [ 4, 4, 4 ];
				connection.query('SELECT * FROM GoalTreeChildren WHERE goal_id = ? AND child_id = ? AND root = ?', params,
				function(err, result) {
					test.equals(err, null);
					test.equals(result.length, 1);
					connection.query('DELETE FROM GoalTreeChildren WHERE goal_id = ? AND child_id = ? AND root = ?', params,
					function(err2, result2) {
						test.equals(err, null);
						connection.end();
						test.done();
					});
				});
			});
		});
	}
}

exports.completed = {
	markComplete: function(test) {
		var goal_id = 3;
		var user_id = 1;
		mysql.getConnection(function( connection ) {
			connection.query('SELECT * FROM Goal WHERE goal_id = ?', [goal_id], function(err, result) {
				test.equals(err, null);
				test.equals(result[0].completed_timestamp, null);
				goalProvider.markGoalComplete(goal_id, user_id, function(err, result) {
					test.equals(err, null);
					test.equals(result, true);
					connection.query('SELECT * FROM Goal WHERE goal_id = ?', [goal_id], function(err, result) {
						test.equals(err, null);
						test.notEqual(result[0].completed_timestamp, null);
						connection.query('UPDATE Goal SET completed_timestamp = NULL WHERE goal_id=?', [goal_id],function(err, result) {
							test.equals(err, null);
							connection.end();
							test.done();
						});
					});
				});
			});
		});
	},
	markNotComplete: function(test) {
		var goal_id = 3;
		var user_id = 1;
		goalProvider.markGoalComplete(goal_id, user_id, function(err, result) {
			goalProvider.markGoalNotComplete(goal_id, user_id, function(err, result) {
				test.equals(err, null);
				test.equals(result, true);
				mysql.getConnection(function( connection ) {
					connection.query('SELECT * FROM Goal WHERE goal_id = ?', [goal_id], function(err, result) {
						test.equals(err, null);
						test.equals(result[0].completed_timestamp, null);
						connection.end();
						test.done();
					});
				});
			});
		});
	}
}

exports.project = {
	linkGoalToProjectValid: function(test) {
		var goal_id = 0;
		var project_id = 1;
		var user_id = 1;
		goalProvider.linkGoalToProject(goal_id, project_id, user_id, function(err, result) {
			test.equals(err, null);
			test.equals(result, true);
			mysql.getConnection(function( connection ) {
				connection.query('DELETE FROM Goal_Project WHERE goal_id = ? AND project_id = ?', [goal_id, project_id],
				function(err, result) {
					connection.end();
					test.equals(err, null);
					test.equals(result.affectedRows, 1);
					test.done();
				});
			});
		});
	},
	linkGoalToProjectDuplicate: function(test) {
		var goal_id = 0;
		var project_id = 1;
		var user_id = 1;
		goalProvider.linkGoalToProject(goal_id, project_id, user_id, function(err, result) {
			test.equals(err, null);
			test.equals(result, true);
			goalProvider.linkGoalToProject(goal_id, project_id, user_id, function(err, result) {
				test.notEqual(err, null);
				test.equals(result, false);
				mysql.getConnection(function( connection ) {
					connection.query('DELETE FROM Goal_Project WHERE goal_id = ? AND project_id = ?', [goal_id, project_id],
					function(err, result) {
						connection.end();
						test.equals(err, null);
						test.equals(result.affectedRows, 1);
						test.done();
					});
				});
			});
		});
	},
	linkGoalToProjectNotAuthed: function(test) {
		var goal_id = 0;
		var project_id = 1;
		var user_id = -1;
		goalProvider.linkGoalToProject(goal_id, project_id, user_id, function(err, result) {
			test.notEqual(err, null);
			test.equals(err.err, "not allowed");
			test.equals(result, false);
			mysql.getConnection(function( connection ) {
				connection.query('DELETE FROM Goal_Project WHERE goal_id = ? AND project_id = ?', [goal_id, project_id],
				function(err, result) {
					connection.end();
					test.equals(err, null);
					test.equals(result.affectedRows, 0);
					test.done();
				});
			});
		});
	}
}