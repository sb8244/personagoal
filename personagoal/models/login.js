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

exports.LoginProvider = LoginProvider;