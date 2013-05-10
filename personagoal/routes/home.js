exports.index = function(req, res) {
	var goalTreeProvider = require("../models/goaltree");
	var user_id = req.session.user_id;
	goalTreeProvider.getTreeForUser(user_id, function(err, tree) {
		var util = require('util');

		//console.log(util.inspect(tree, false, null));
		generateTreeHTML(tree, function(html) {
			console.log("Rendering home view");
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
	var generateNodeHTML = function(node, callback, well) {
		//We're going to build some html along the way
		var html = "";
		html += "<div class='goal-container "+well+"'>";
		if(node.user_own === true ) {
			html += "<input type='checkbox' data-id='"+node.id+"'/>";	
		} else {
			html += "<input type='checkbox' disabled='disabled'/>";
		}
		html += "<span class='title' data-id='"+node.id+"'>" + node.data.title + "</span>";
		//html += "<span class='due-date' data-id='"+node.id+"'>" + node.data.due_date + "</span>";
		html += "<span class='users'>";
		//Iterate over the users object
		async.each(Object.keys(node.users), function(user_id, callback) {
			html += "<span>" + node.users[user_id] + "</span>";
			callback();
		}, function() {
			html += "</span>";
			if(node.children != null) {
				html += "<div class='goal-children well'>";
				//iterate over each child and recursively call this function to do so
				async.each(Object.keys(node.children), function(child_id, callback) {
					generateNodeHTML(node.children[child_id], function(result) {
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
		generateNodeHTML(tree[id], function(result) {
			html += result;
			return callback();
		}, "well")
	}, function() {
		return exit_callback(html);
	});
}