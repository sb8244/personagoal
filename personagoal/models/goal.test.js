var GoalProvider = require("./goal").GoalProvider;
var MySQL = require('./mysql').MySQL;

exports.insert = {
	goalInsert: function(test) {
		var mysql = new MySQL();
		test.expect(2);
		var task_id = 0;
		var due_date = new Date();
		var goalProvider = new GoalProvider();
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
		var goalProvider = new GoalProvider();
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
		var goalProvider = new GoalProvider();
		//these are constants in the test database and should not be deleted
		var user_id = 1;
		var goal_id = 0;
		goalProvider.linkUserToGoal(user_id, goal_id, function(err, result) {
			test.equals(result, true, "Result should be true");
			goalProvider.linkUserToGoal(user_id, goal_id, function(errInner, resultInner) {
				test.equals(resultInner, null, "Result should be null");
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
/*
exports.get = {
	getUserTasks: function(test) {
		test.expect(5);
		var taskProvider = new TaskProvider();
		//these are constants in the test database and should not be deleted
		var user_id = 1;
		var task_id = 2;
		taskProvider.linkUserToTask(user_id, task_id, function(err, result) {
			test.equals(result, true, "Result should be true");
			taskProvider.getTasksForUser(user_id, function(err, result) {
				test.equals(err, null, "Err should be null");
				test.equals(result[0].task_id, 2, "Task ID should be 2");
				test.equals(result[0].user_id, 1, "User ID should be 1");
				test.equals(result.length, 1, "Should be 1 result");
				connection.query('DELETE FROM User_Task WHERE user_id = ? AND task_id = ?', [user_id, task_id], 
				function() {
					test.done();
				});
			});
		});
	}
};*/