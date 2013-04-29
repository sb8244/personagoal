var LoginProvider = require("./login").LoginProvider;

//Mock a session object
global.req = {};
global.req.session = {};

/*
 * This login is invalid, should return false and not change the session
 */
exports.testInvalidLogin = function(test) {
	var login = new LoginProvider(true);
	test.equal(req.session.user_id, undefined, "Session isn't empty");
	login.login("1","1", req, function(result) {
		test.equal(result, false, "Result should be false");
		test.equal(req.session.user_id, undefined, "Session should be empty");
		test.done();
	});
}

/*
 * This login is valid, should return true and set the user_id in the session
 */
exports.testValidLogin = function(test) {
	var login = new LoginProvider(true);
	test.equal(req.session.user_id, undefined, "Session isn't empty");
	login.login("checkLogin@test.com","password", req, function(result) {
		test.equal(result, true, "Result should be true");
		test.equal(req.session.user_id, 1, "Session should have the user_id");
		test.done();
	});
}