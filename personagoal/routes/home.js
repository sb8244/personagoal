exports.index = function(req, res) {
	var goalTreeProvider = require("../models/goaltree");
	var user_id = req.session.user_id;
	goalTreeProvider.getTreeForUser(user_id, function(err, tree) {
		var util = require('util');
		//console.log(util.inspect(tree, false, null));
		generateTreeHTML(tree, function(html) {
			res.render('home', {
				title: 'Home',
				goaltree: html
			});
		});
	});
}

var async = require("async");
/* 
 * This isn't in the model because models don't care about html
 *
 * Holy shit it works!
 */
var generateTreeHTML = function(tree, exit_callback) {
	//define a recursive function for processing a node and it's chilren
	var generateNodeHTML = function(node, well, callback) {
		//We're going to build some html along the way
		var html = "";
		html += "<div class='goal-container "+well+ " complete-" + node.completed + "'>";
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
			callback();
		}, function() {
			html += "</span>";
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