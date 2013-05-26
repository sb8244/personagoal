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
		var user_id = 2;
		test.expect(7);
		projectProvider.createProject("Test - Temporary", function(err, project_id) {
			test.equals(err, null);
			test.notEqual(project_id, null);
			projectProvider.linkUserToProject(user_id, project_id, function(err, result) {
				test.equals(err, null);
				projectProvider.setDescription(project_id, desc, user_id, function(err, result) {
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
		});
	},
	setDescriptionNotAuthorized: function(test) {
		test.expect(2);
		projectProvider.setDescription(-1, "This is a test 123", 1, function(err, result) {
			test.equals(err.err, "not allowed");
			test.equals(result, null);
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

var goalProvider = require("./goal");
var taskProvider = require("./task");
exports.delete = {
	//Some of this stuff could be in parallel but it's not an issue for testing
	deleteValid: function(test) {
		var user_id = 2;
		//create project
		projectProvider.createProject("Test - Temporary", function(err, project_id) {
			test.equals(err, null);
			test.notEqual(project_id, null);
			//link user to project
			projectProvider.linkUserToProject(user_id, project_id, function(err, result) {
				test.equals(result, true);
				//create task
				taskProvider.createTask({title: "Test"}, function(err, task_id) {
					test.equals(err, null);
					test.notEqual(task_id, null);
					//create goal from task
					goalProvider.createGoal(new Date(null), task_id, function( err, goal_id ) {
						test.equals(err, null);
						test.notEqual(goal_id, null);
						goalProvider.linkGoalToParent(goal_id, null, function(err, result) {
							test.equals(err, null);
							//link user to goal
							goalProvider.linkUserToGoal(user_id, goal_id, function(err, result) {
								test.equals(result, true);
								//link goal to project
								goalProvider.linkGoalToProject(goal_id, project_id, user_id, function(err, result) {
									test.equals(result, true);
									//now delete the project
									projectProvider.deleteProject(project_id, user_id, function(err, result) {
										test.equals(err, null);
										test.equals(result, true);
										//now check that it was done correctly
										mysql.getConnection(function(connection) {
											connection.query("SELECT * FROM Project WHERE project_id = ?", [project_id], function(err, result) {
												test.equals(result.length, 0);
												connection.query("SELECT * FROM Task WHERE task_id = ?", [task_id], function(err, result) {
													test.equals(result.length, 0);
													connection.query("SELECT * FROM Goal WHERE goal_id = ?", [goal_id], function(err, result) {
														test.equals(result.length, 0);
														connection.query("SELECT * FROM User_Goal WHERE user_id = ? AND goal_id = ?", [user_id, goal_id], function(err, result){
															test.equals(result.length, 0);
															connection.query("SELECT * FROM User_Project WHERE project_id = ?", [project_id], function(err, result) {
																test.equals(result.length, 0);
																connection.query("SELECT * FROM GoalTreeChildren WHERE goal_id = ?", [goal_id], function(err, result) {
																	test.equals(result.length, 0);
																	test.done();
																});
															});
														});
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	},
	deleteNotAuthorized: function(test) {
		var user_id = 2;
		var project_id = 1;
		projectProvider.deleteProject(project_id, user_id, function(err, result) {
			test.equals(err.err, "not allowed");
			test.equals(result, null);
			test.done();
		});
	}
}