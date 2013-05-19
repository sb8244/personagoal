var async = require("async");
var goalHtml = require("../html_models/goal");
exports.index = function(req, res) {
	var project_id = 1;
	var goalTreeProvider = require("../models/goaltree");
	var user_id = req.session.user_id;
	async.parallel([function(callback) {
		goalTreeProvider.getTreeForUser(user_id, project_id, function(err, tree) {
			if(err) return callback(err, null);
			goalHtml.generateTreeHTML(tree, function(html) {	
				return callback(null, html);
			});
		});
	}, function(callback) {
		goalTreeProvider.getOverdueGoalsForUser(user_id, project_id, function(err, nodes) {
			if(err) return callback(err, null);
			if(Object.keys( nodes ).length !== 0) {
				goalHtml.generateOverdueHTML(nodes, function(html) {
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
