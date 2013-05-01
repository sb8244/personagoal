var TaskProvider = require("./task").TaskProvider;
var MySQL = require('./mysql').MySQL;

exports.insert = {
	taskInsert: function(test) {
		var mysql = new MySQL(true);
		var connection = mysql.getConnection();
		test.expect(2);
		var data = { 
			title: "Test Title",
			description: "Test"
		};
		var taskProvider = new TaskProvider(true);
		taskProvider.createTask(data, function(err, result) {
			test.equals(err, null, "Error should be null");
			test.notEqual(result, null, "Result should not be null");
			connection.query('DELETE FROM Task WHERE task_id = ?', [result], function(err, result) {
				test.done();
			});
		});
	},

	taskLinkUser: function(test) {
		test.expect(2);
		var taskProvider = new TaskProvider(true);
		//these are constants in the test database and should not be deleted
		var user_id = 1;
		var task_id = 2;
		taskProvider.linkUserToTask(user_id, task_id, function(err, result) {
			test.equals(result, true, "Result should be true");
			test.equals(err, null, "Err should be null");
			connection.query('DELETE FROM User_Task WHERE user_id = ? AND task_id = ?', [user_id, task_id], 
			function() {
				test.done();
			});
		});
	},

	taskLinkUserDuplicate: function(test) {
		test.expect(4);
		var taskProvider = new TaskProvider(true);
		//these are constants in the test database and should not be deleted
		var user_id = 1;
		var task_id = 2;
		taskProvider.linkUserToTask(user_id, task_id, function(err, result) {
			test.equals(result, true, "Result should be true");
			taskProvider.linkUserToTask(user_id, task_id, function(errInner, resultInner) {
				test.equals(resultInner, null, "Result should be null");
				test.equals(errInner.task, "duplicate", "Error.task should be duplicate");
				test.notEqual(errInner, null, "Err should not be null");
				connection.query('DELETE FROM User_Task WHERE user_id = ? AND task_id = ?', [user_id, task_id], 
				function() {
					test.done();
				});
			});
		});
	}
};