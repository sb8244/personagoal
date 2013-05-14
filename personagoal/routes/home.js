exports.index = function(req, res) {
	var goalTreeProvider = require("../models/goaltree");
	var user_id = req.session.user_id;
	async.parallel([function(callback) {
		goalTreeProvider.getTreeForUser(user_id, function(err, tree) {
			if(err) return callback(err, null);
			generateTreeHTML(tree, function(html) {	
				return callback(null, html);
			});
		});
	}, function(callback) {
		goalTreeProvider.getOverdueGoalsForUser(user_id, function(err, nodes) {
			if(err) return callback(err, null);
			if(Object.keys( nodes ).length !== 0) {
				generateOverdueHTML(nodes, function(html) {
					return callback(null, html);
				});
			} else {
				return callback(null);
			}
		});
	}], function(err, results) {
		if(err) throw err;
		else {
			res.render('home', {
				title: 'Home',
				goaltree: results[0],
				overdue: results[1]
			});
		}
	});
}

var async = require("async");

var generateGoalContentHTML = function(node, well, callback) {
	//We're going to build some html along the way
	var html = "";
	var checked = "";
	if(node.completed === true) {
		checked = " checked='checked' ";
	}
	if(node.user_own === true && node.completed === false) {
		html += "<input type='checkbox' data-id='"+node.id+"' + " + checked + "/>";	
	} else {
		html += "<input type='checkbox' disabled='disabled'" + checked + "/>";
	}
	html += "<span class='title' data-id='"+node.id+"'>" + node.data.title + "</span>";
	html += "<span class='due-date' data-id='"+node.id+"'> - Due: " + node.data.due_date + "</span>";
	html += "<span class='users'>";
	//Iterate over the users object
	var user_count = 0;
	var max_display = 2;
	async.each(Object.keys(node.users), function(user_id, callback) {
		user_count++;
		if(user_count <= max_display)  
			html += "<span data-id='"+user_id+"'>" + node.users[user_id] + "</span>";
		else if(user_count == max_display)
			html += "<span>More</span>";
		return callback();
	}, function() {
		html += "</span>";
		return callback(html);
	});
}

var generateTreeHTML = function(tree, exit_callback) {
	//define a recursive function for processing a node and it's chilren
	var generateNodeHTML = function(node, well, callback) {
		var html = "<div class='goal-container "+well+ " complete-" + node.completed + " overdue-" + node.overdue + "''>";
		generateGoalContentHTML(node, well, function(result) {
			html += result;
			if(node.children != null) {
				html += "<div class='goal-children well'>";
				//iterate over each child and recursively call this function to do so
				async.each(Object.keys(node.children), function(child_id, callback) {
					generateNodeHTML(node.children[child_id], "", function(result) {
						html += result;
						return callback();
					})
				}, function() {
					//We're done, close tags and callback
					html += "</div></div>";
					return callback(html);
				});
			} else { 
				//no children so close tags and callback
				html += "</div>";
				return callback(html);
			}
		});
	}
	var html = "";
	//Iterate over the root nodes and process them with the above function, building html along the way
	async.each(Object.keys(tree), function(id, callback) {
		generateNodeHTML(tree[id], "well", function(result) {
			html += result;
			return callback();
		})
	}, function() {
		return exit_callback(html);
	});
}

var generateOverdueHTML = function(nodes, exit_callback) {
	var generateNodeHTML = function(node, callback) {
		var html = "<div class='goal-container complete-" + node.completed + " overdue-true''>";
		generateGoalContentHTML(node, "", function(result) {
			html += result;
			html += "</div>";
			return callback(html);
		});
	}
	var html ="<div class='well'>";
	async.each(Object.keys(nodes), function(id, callback) {
		generateNodeHTML(nodes[id], function(result) {
			html += result;
			return callback();
		})
	}, function() {
		html += "</div>";
		return exit_callback(html);
	});

}