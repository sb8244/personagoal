var UserProvider = require("./user").UserProvider;

var LoginProvider = function() {
}

LoginProvider.prototype.login = function(email, password, req, callback) {
	var userProvider = new UserProvider();
	userProvider.checkLogin(email, password, function(result) {
		if(result === false) {
			callback(false);
		} else {
			req.session.user_id = result;
			callback(true);
		}
	});
}

LoginProvider.prototype.isLoggedIn = function(req, callback) {
	if(global.debug === true)
		req.session.user_id = 2;
	callback(req.session.user_id != undefined);
}

LoginProvider.prototype.logout = function(req, callback) {
	req.session.user_id = undefined;
	callback();
}

exports.LoginProvider = LoginProvider;