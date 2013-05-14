exports.basegoal = function(req, res) {
	createUserSelect(function(html) {
		res.render('partials/newgoal', {user_select: html});
	});
}

function createUserSelect(callback) {
	var userProvider = require("../models/user");
	var async = require("async");
	var html = "<select name='users' data-placeholder='Assign to users' multiple='multiple' data-role='multiselect' size='1'>";
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