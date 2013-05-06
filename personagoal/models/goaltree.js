var MySQL = require('./mysql').MySQL;

var GoalTreeProvider = function() {
	mysql = new MySQL();
}

GoalTreeProvider.prototype.getTreeForUser = function(user_id, callback) {
	params = [ user_id, user_id, user_id ];
	mysql.getConnection(function(connection) {
		connection.query(selectStatements, params, function(err, results) {
			if(err) { callback(err, null); }
			else {
				constructGoalTree(results, function(goalTree) {	
					console.log(goalTree);
					callback(null, goalTree);
				});
			}
		});
	});
}

var selectStatements = 'SELECT * FROM ( SELECT DISTINCT User_Goal.user_id, Goal.goal_id, title, due_date, NULL as parent_id, NULL as child_id, root FROM User_Goal JOIN Goal ON User_Goal.goal_id = Goal.goal_id LEFT OUTER JOIN GoalTreeChildren ON Goal.goal_id = GoalTreeChildren.goal_id OR Goal.goal_id = GoalTreeChildren.child_id JOIN Task ON Goal.task_id = Task.task_id WHERE User_Goal.user_id = ? UNION SELECT DISTINCT User_Goal.user_id, GoalTreeChildren.goal_id as goal_id, title, due_date, null as parent_id, GoalTreeChildren.child_id as child_id, root FROM User_Goal JOIN GoalTreeChildren ON User_Goal.goal_id = GoalTreeChildren.child_id JOIN Goal ON GoalTreeChildren.goal_id = Goal.goal_id JOIN Task ON Goal.task_id = Task.task_id WHERE User_Goal.user_id = ? UNION SELECT DISTINCT User_Goal.user_id, GoalTreeChildren.child_id as goal_id, title, due_date, GoalTreeChildren.goal_id as parent_id, null as child_id, root FROM User_Goal JOIN GoalTreeChildren ON User_Goal.goal_id = GoalTreeChildren.goal_id JOIN Goal ON GoalTreeChildren.goal_id = Goal.goal_id JOIN Task ON Goal.task_id = Task.task_id WHERE User_Goal.user_id = ? ) a ORDER BY goal_id';

exports.GoalTreeProvider = GoalTreeProvider;

var constructGoalTree = function(results, callback) {
	var nodes = {};
	results.forEach(function(item) {
		console.log(item);
		if(nodes[item.goal_id] == undefined) {
			nodes[item.goal_id] = {};
		}
		nodes[item.goal_id].children = {};
		nodes[item.goal_id].parent = null;
		nodes[item.goal_id].root = item.root;
	});
	results.forEach(function(item) {
		if(nodes[item.goal_id].data == undefined) {
			nodes[item.goal_id].data = {
				title: item.title,
				due_date: item.due_date
			};
		}
		if(nodes[item.goal_id].parent == null && item.parent_id != null && item.goal_id != item.parent_id) {
			nodes[item.goal_id].parent = nodes[item.parent_id];
			nodes[item.parent_id].children[item.goal_id] = nodes[item.goal_id];
		}
		if(item.child_id != null && item.child_id != item.goal_id) {
			nodes[item.goal_id].children[item.child_id] = nodes[item.child_id];
			nodes[item.child_id].parent = nodes[item.goal_id];
		}
	});
	callback(nodes);
}
