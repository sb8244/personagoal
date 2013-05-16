var async = require("async");
var userProvider = require("../models/user");
var taskProvider = require("../models/task");
var goalProvider = require("../models/goal");

exports.markgoal = function(req, res) {
	req.assert('goal_id', 'Invalid Goal Id').notEmpty().isNumeric();
	req.assert('action', 'Invalid Action').notEmpty().isAlpha();
	var goal_id = req.param("goal_id");
	var user_id = req.session.user_id;
	var action = req.param("action");
	var errors = req.validationErrors();
	if(errors) {
		res.send(errors, 500);
		return;
	}
	if(action == "true") {
		goalProvider.markGoalComplete(goal_id, user_id, function(err, result) {
			if(err) {
				res.send("error", 500);
				return;
			} else {
				res.send({success: true}, 200);
				return;
			}
		});
	} else if(action == "false") {
		goalProvider.markGoalNotComplete(goal_id, user_id, function(err, result) {
			if(err) {
				res.send("error", 500);
				return;
			} else {
				res.send({success: true}, 200);
				return;
			}
		});
	}
}

exports.basegoal = function(req, res) {
	createUserSelect(function(html) {
		res.render('partials/newgoal', {user_select: html});
	});
}

exports.basegoalprocess = function(req, res) {
	req.assert('title', 'Invalid Title').notEmpty();
	if(!Array.isArray(req.param('users'))) {
		//this should fail everytime, sort of hacky
		req.assert('users', 'Select Users').isAlpha().isNumeric();
	}
	if(req.param("due_date") != "") {
		req.assert('due_date', 'Invalid Due Date').notEmpty().isDate();
	}

	var parent_id;
	if(req.param("parent_id") != "null") {
		req.assert('parent_id', 'Invalid Parent').notEmpty().isNumeric();
		parent_id = req.param("parent_id");
	} else {
		parent_id = null;
	}
	var errors = req.validationErrors();
	if (errors) {
		res.send(errors, 500);
		return;
	} else {
		var title = req.param('title');
		var users = req.param('users');
		var due_date = new Date(req.param('due_date'));
		taskProvider.createTask({title: title, description: null}, function(err, task_id) {
			if(err) throw err;
			else {
				goalProvider.createGoal(due_date, task_id, function(err, goal_id) {
					if(err) throw err;
					else {
						async.parallel([
							function(callback) {
								async.each(users, function(user_id, callback) {
									goalProvider.linkUserToGoal(user_id, goal_id, function(err, result) {
										return callback(err);
									})
								}, function(err, results) {
									return callback(err);
								});
							},
							function(callback) {
								goalProvider.linkGoalToParent(goal_id, parent_id, function(err, result) {
									return callback(err);
								});
							}
						], function(err, results) {
							if(err) throw err;
							res.send({title: title, users: users,
									  due_date: due_date, parent_id: parent_id}, 200);
						});
					}
				});
			}
		})
		return;
	}
}

function createUserSelect(callback) {
	var html = "<select name='users[]' data-placeholder='Assign to users - Required' multiple='multiple' data-role='multiselect' size='1'>";
	userProvider.listUsers(function(users) {
		async.eachSeries(users, function(user, callback) {
			html += "<option value='" + user.user_id + "'>" + user.name + "</option>";
			callback();
		}, function() {
			html += "</select>";
			callback(html);
		});
	});
}