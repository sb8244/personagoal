var mysql = require('./mysql');
var async = require('async');
var dateFormat = require("dateformat");

var prefix = "SELECT a.*, User_Goal.user_id, User_Detail.name FROM ( ";
var postfix = ") AS a LEFT OUTER JOIN User_Goal AS User_Goal ON a.goal_id = User_Goal.goal_id LEFT OUTER JOIN User_Detail ON User_Goal.user_id = User_Detail.user_id ORDER BY a.goal_id";

exports.getOverdueGoalsForUser = function(user_id, project_id, callback) {
	var selectStatement = prefix + "SELECT * FROM `User_Goal` NATURAL JOIN `Goal` NATURAL JOIN Goal_Project NATURAL JOIN Task WHERE due_date > 0 AND due_date < CURRENT_TIMESTAMP AND user_id=? AND completed_timestamp IS NULL AND project_id = ?" + postfix;
	var params = [ user_id, project_id ];
	mysql.getConnection(function(connection) {
		query = connection.query(selectStatement, params, function(err, results) {
			connection.end();
			if(err) { return callback(err, null); }
			else {
				nodeCreation(results, user_id, function(nodes) {
					return callback(null, nodes);
				})
			}
		});
	});
}

exports.getTreeForUser = function(user_id, project_id, callback) {
	//var selectStatements = "SELECT a.*, User_Goal.user_id, User_Detail.name FROM ( SELECT DISTINCT User_Goal.user_id, Goal.goal_id, title, due_date, NULL as parent_id, NULL as child_id, root, completed_timestamp FROM User_Goal JOIN Goal ON User_Goal.goal_id = Goal.goal_id LEFT OUTER JOIN GoalTreeChildren ON Goal.goal_id = GoalTreeChildren.goal_id OR Goal.goal_id = GoalTreeChildren.child_id JOIN Task ON Goal.task_id = Task.task_id WHERE User_Goal.user_id = ? UNION SELECT DISTINCT User_Goal.user_id, GoalTreeChildren.goal_id as goal_id, title, due_date, null as parent_id, GoalTreeChildren.child_id as child_id, root, completed_timestamp FROM User_Goal JOIN GoalTreeChildren ON User_Goal.goal_id = GoalTreeChildren.child_id JOIN Goal ON GoalTreeChildren.goal_id = Goal.goal_id JOIN Task ON Goal.task_id = Task.task_id WHERE User_Goal.user_id = ? UNION SELECT DISTINCT User_Goal.user_id, GoalTreeChildren.child_id as goal_id, title, due_date, GoalTreeChildren.goal_id as parent_id, null as child_id, root, completed_timestamp FROM User_Goal JOIN GoalTreeChildren ON User_Goal.goal_id = GoalTreeChildren.goal_id JOIN Goal ON GoalTreeChildren.child_id = Goal.goal_id JOIN Task ON Goal.task_id = Task.task_id WHERE User_Goal.user_id = ? ) as a LEFT OUTER JOIN User_Goal ON a.goal_id = User_Goal.goal_id LEFT OUTER JOIN User_Detail ON User_Goal.user_id = User_Detail.user_id ORDER BY goal_id";
	var selectStatements = "SELECT a.*, User_Goal.user_id, User_Detail.name FROM ( SELECT DISTINCT Goal.goal_id, title, due_date, NULL as parent_id, NULL as child_id, root, completed_timestamp FROM User_Goal JOIN Goal_Project ON User_Goal.goal_id = Goal_Project.goal_id JOIN Goal ON User_Goal.goal_id = Goal.goal_id LEFT OUTER JOIN GoalTreeChildren ON Goal.goal_id = GoalTreeChildren.goal_id OR Goal.goal_id = GoalTreeChildren.child_id JOIN Task ON Goal.task_id = Task.task_id WHERE User_Goal.user_id = ? AND Goal_Project.project_id = ? UNION SELECT DISTINCT GoalTreeChildren.goal_id as goal_id, title, due_date, null as parent_id, GoalTreeChildren.child_id as child_id, root, completed_timestamp FROM User_Goal JOIN GoalTreeChildren ON User_Goal.goal_id = GoalTreeChildren.child_id JOIN Goal_Project ON GoalTreeChildren.goal_id = Goal_Project.goal_id JOIN Goal ON GoalTreeChildren.goal_id = Goal.goal_id JOIN Task ON Goal.task_id = Task.task_id WHERE User_Goal.user_id = ? AND Goal_Project.project_id = ? UNION SELECT DISTINCT GoalTreeChildren.child_id as goal_id, title, due_date, GoalTreeChildren.goal_id as parent_id, null as child_id, root, completed_timestamp FROM User_Goal JOIN GoalTreeChildren ON User_Goal.goal_id = GoalTreeChildren.goal_id JOIN Goal_Project ON GoalTreeChildren.child_id = Goal_Project.goal_id JOIN Goal ON GoalTreeChildren.child_id = Goal.goal_id JOIN Task ON Goal.task_id = Task.task_id WHERE User_Goal.user_id = ? AND Goal_Project.project_id = ? ) AS a LEFT OUTER JOIN User_Goal ON a.goal_id = User_Goal.goal_id LEFT OUTER JOIN User_Detail ON User_Goal.user_id = User_Detail.user_id ORDER BY a.goal_id";
	var params = [ user_id, project_id, user_id, project_id, user_id, project_id ];
	mysql.getConnection(function(connection) {
		var query = connection.query(selectStatements, params, function(err, results) {
			connection.end();
			if(err) { return callback(err, null); }
			else {
				constructGoalTree(results, user_id, function(goalTree) {	
					return callback(null, goalTree);
				});
			}
		});
	});
}
var nodeCreation = function(results, user_id, callback) {
	var nodes = {};
	//Iterate over each SQL result and construct initial nodes with empty pointers
	async.each(results, 
		function(item, asyncCallback) {
			if(nodes[item.goal_id] == undefined) {
				nodes[item.goal_id] = {};
			}
			nodes[item.goal_id].children = null;
			nodes[item.goal_id].parent = null;
			nodes[item.goal_id].root = item.root;
			nodes[item.goal_id].completed = false;
			if(nodes[item.goal_id].user_own !== true)
				nodes[item.goal_id].user_own = false;
			if(nodes[item.goal_id].users == undefined) {
				nodes[item.goal_id].users = {};
			} 
			//Append the users who own this goal
			if(item.name != null && item.user_id != null) {
				if(item.user_id == user_id) {
					nodes[item.goal_id].user_own = true;
				}
				nodes[item.goal_id].users[item.user_id] = item.name;
			}
			
			nodes[item.goal_id].id = item.goal_id;
			nodes[item.goal_id].overdue = false;
			if(item.due_date == 'Invalid Date') {
				item.due_date = "No Due Date";
			} else {
				if(item.due_date < new Date()) {
					nodes[item.goal_id].overdue = true;
				}
				item.due_date = dateFormat(item.due_date, "m/dd/yy");
			}
			if(item.completed_timestamp != null) {
				nodes[item.goal_id].completed = true;
			}
			nodes[item.goal_id].data = {
				title: item.title,
				due_date: item.due_date
			};
			return asyncCallback();
		},
		function(err) {
			if(err) return callback(err);
			else return callback(nodes);
		}
	);	
}
var constructGoalTree = function(results, user_id, callback) {
	var child_ids = [];
	var nodes = {};
	var stepOne = function(seriesCallback) {
		nodeCreation(results, user_id, function(result) {
			nodes = result;
			return seriesCallback();
		});
	}
	var stepTwo = function(seriesCallback) {
		async.series([
			function(innerSeriesCallback) {
				//now iterate through the results again
				async.each(results, 
					function(item, asyncCallback) {
						//If there is a parent that isn't itself, set the parent node and child nodes
						if(nodes[item.goal_id].parent == null && item.parent_id != null && item.goal_id != item.parent_id) {
							nodes[item.goal_id].parent = nodes[item.parent_id];
							if(nodes[item.parent_id].children == null)
								nodes[item.parent_id].children = {};
							nodes[item.parent_id].children[item.goal_id] = nodes[item.goal_id];
							child_ids.push(item.goal_id);
						}
						//If the child id is set and it isn't itself, set the child node and parent node
						if(item.child_id != null && item.child_id != item.goal_id) {
							if(nodes[item.goal_id].children == null)
								nodes[item.goal_id].children = {};
							nodes[item.goal_id].children[item.child_id] = nodes[item.child_id];
							nodes[item.child_id].parent = nodes[item.goal_id];
							child_ids.push(item.child_id);
						}
						return asyncCallback();
					},
					function(err) {
						if(err) return callback(null);
						else return innerSeriesCallback();
					}
				);
			}, 
			function(innerSeriesCallback) {
				//Remove the non root instances so the tree becomes a tree
				child_ids.forEach(function(child_id) {
					delete nodes[child_id];
				});
				return innerSeriesCallback();
			}
		], function(err, results) {
			if(err) return callback(null);
			else return seriesCallback();
		});
	}

	//execute the steps in series
	async.series([stepOne, stepTwo], function(err, results) {
		if(err) return callback(null);
		else return callback(nodes);
	});
}