var TaskProvider = require("./task").TaskProvider;
var MySQL = require('./mysql').MySQL;

exports.insert = {
	taskInsert: function(test) {
		var mysql = new MySQL(true);
		test.expect(2);
		var data = { 
			title: "Test Title",
			description: "Test"
		};
		var taskProvider = new TaskProvider(true);
		taskProvider.createTask(data, function(err, result) {
			test.equals(err, null, "Error should be null");
			test.notEqual(result, null, "Result should not be null");
			mysql.getConnection(function( connection ) {
				connection.query('DELETE FROM Task WHERE task_id = ?', [result], function(err, result) {
					connection.end();
					test.done();
				});
			});
		});
	}
};