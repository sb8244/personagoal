var UserProvider = require("./user").UserProvider;

var LoginProvider = function(useTestDB) {
	testDB = useTestDB;
}

LoginProvider.prototype.login = function(email, password, req, callback) {
	var userProvider = new UserProvider(testDB);
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
	callback(req.session.user_id != undefined);
}

LoginProvider.prototype.logout = function(req, callback) {
	req.session.user_id = undefined;
	callback();
}

exports.LoginProvider = LoginProvider;