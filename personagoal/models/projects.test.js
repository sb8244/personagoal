var projectProvider = require("./project");
var mysql = require('./mysql');
exports.insert = {
	createProject: function(test) {
		test.expect(3);
		projectProvider.createProject("Test - Temporary", function(err, project_id) {
			test.equals(err, null);
			test.notEqual(project_id, null);
			mysql.getConnection(function( connection ) {
				connection.query('DELETE FROM Project WHERE project_id = ?', [project_id], function(err, result) {
					test.equals(err, null);
					connection.end();
					test.done();
				});
			});
		});
	}
}

exports.setDescription = {
	setDescriptionValid: function(test) {
		var desc = "This is a test 123";
		test.expect(6);
		projectProvider.createProject("Test - Temporary", function(err, project_id) {
			test.equals(err, null);
			test.notEqual(project_id, null);
			projectProvider.setDescription(project_id, desc, function(err, result) {
				test.equals(err, null);
				test.equals(result, true);
				mysql.getConnection(function( connection ) {
					connection.query('SELECT * FROM Project WHERE project_id = ?', [project_id], function(err, result) {
						test.equals(result[0].description, desc);
						connection.query('DELETE FROM Project WHERE project_id = ?', [project_id], function(err, result) {
							test.equals(err, null);
							connection.end();
							test.done();
						});
					});
				});
			});
		});
	},
	setDescriptionNoProject: function(test) {
		test.expect(2);
		projectProvider.setDescription(0, "This is a test 123", function(err, result) {
			test.equals(err, null);
			test.equals(result, false);
			test.done();
		});
	}
}

exports.linkUserToProject = {
	linkUserValid: function(test) {
		test.expect(3);
		var user_id = 2;
		var project_id = 1;
		projectProvider.linkUserToProject(user_id, project_id, function(err, result) {
			test.equals(err, null);
			test.equals(result, true);
			mysql.getConnection(function( connection ) {
				connection.query('DELETE FROM User_Project WHERE user_id = ? AND project_id = ?', 
					[user_id, project_id], function(err, result) {
						test.equals(err, null);
						connection.end();
						test.done();
				});
			});
		});
	},
	linkUserDuplicate: function(test) {
		test.expect(5);
		var user_id = 2;
		var project_id = 1;
		projectProvider.linkUserToProject(user_id, project_id, function(err, result) {
			test.equals(err, null);
			test.equals(result, true);
			projectProvider.linkUserToProject(user_id, project_id, function(err, result) {
				test.notEqual(err, null);
				test.equals(result, null);
				mysql.getConnection(function( connection ) {
					connection.query('DELETE FROM User_Project WHERE user_id = ? AND project_id = ?', 
						[user_id, project_id], function(err, result) {
							test.equals(err, null);
							connection.end();
							test.done();
					});
				});
			});
		});
	}
}