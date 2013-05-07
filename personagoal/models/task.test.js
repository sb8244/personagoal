var taskProvider = require("./task");
var mysql = require('./mysql');

exports.insert = {
	taskInsert: function(test) {
		test.expect(2);
		var data = { 
			title: "Test Title",
			description: "Test"
		};
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