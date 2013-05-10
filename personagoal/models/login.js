var userProvider = require("./user");

exports.login = function(email, password, req, callback) {
	userProvider.checkLogin(email, password, function(result) {
		if(result === false) {
			return callback(false);
		} else {
			req.session.user_id = result;
			return callback(true);
		}
	});
}

exports.isLoggedIn = function(req, callback) {
	if(global.user_id != undefined)
		req.session.user_id = global.user_id;
	return callback(req.session.user_id != undefined);
}

exports.logout = function(req, callback) {
	req.session.user_id = undefined;
	return callback();
}