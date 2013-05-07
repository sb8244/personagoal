var userProvider = require("./user");
var mysql = require('./mysql');

var testEmail = "testRegister@test.com";
/*
 * Group of testing that registers the user
 */
exports.testRegister = {
	/*
	 * We should clean up our test so we can test some mores
	 */
	tearDown: function(callback){
		params = [testEmail];
		mysql.getConnection(function( connection ) {
			connection.query('DELETE FROM User WHERE email=?', params, function() {
				connection.end();
				callback();
			});
		});
	},
	/*
	 * Tests the registration function in the UserProvider
	 *
	 * Checks the normalization across tables
	 */
	testRegister: function(test) {
		test.expect(10);
		params = [testEmail];
		mysql.getConnection(function( connection ) {
			connection.query('SELECT * FROM User WHERE email=?', params,
				function(err, result) {
					connection.end();
					if( err ) {
						throw ( err );
					} else {
						test.equal(result.length, 0, "Result not empty");
						stepTwo();
					}
				}
			);
		});

		var stepTwo = function() {
			insertParams = {
				name: "testRegister",
				role: "tester",
				email: testEmail,
				password: "password"
			};
			userProvider.createNewUser(insertParams, function(err, id) {
				mysql.getConnection(function( connection ) {
					connection.query('SELECT * FROM User WHERE email=?', params, function(err, result) {
						connection.end();
						if( err ) {
							throw ( err );
						} else {
							test.equal(result.length, 1, "Result empty");
							test.equal(result[0].email, insertParams.email, "Email not equal");
							test.equal(result[0].user_id, id, "ID isn't matching up");
							stepCall();
						}
					});
				});
				mysql.getConnection(function( connection ) {
					connection.query('SELECT * FROM User_Detail WHERE user_id=?', [id], function(err, result) {
						connection.end();
						if( err ) {
							throw ( err );
						} else {
							test.equal(result.length, 1, "Result empty");
							test.equal(result[0].name, insertParams.name, "Name not equal");
							test.equal(result[0].role, insertParams.role, "Role not equal");
							test.equal(result[0].image_path, null, "Image Path isn't null");
							stepCall();
						}
					});
				});
				mysql.getConnection(function( connection ) {
					connection.query('SELECT * FROM User_Password WHERE user_id=?', [id], function(err, result) {
						connection.end();
						if( err ) {
							throw ( err );
						} else {
							test.equal(result.length, 1, "Result empty");
							test.equal(result[0].password, '5f4dcc3b5aa765d61d8327deb882cf99', "Password-md5 not equal");
							stepCall();
						}
					});
				});
			});
		}

		var count = 0;
		var stepCall = function() {
			count++;
			if(count === 3)
				test.done();
		}
	}
}

exports.testDeleteUser = {
	testUserIsDeleted: function(test) {
		test.expect(2);
		insertParams = {
				name: "testRegister",
				role: "tester",
				email: testEmail,
				password: "password"
		};
		//This is already tested above, so can be assumed valid
		userProvider.createNewUser(insertParams, function(err, id) {
			userProvider.removeUser(id, function(err, result) {
				test.equals(result, true);
				test.equals(err, null);
				test.done();
			});
		});
	}
}

/*
 * Group of everything that checks the login
 */
exports.testCheckLogin = {
	/*
	 * Check that a valid login works
	 */
	testCheckLoginValid: function(test) {
		test.expect(2);
		var email = "checkLogin@test.com";
		var params = [ email ];
		mysql.getConnection(function( connection ) {
			connection.query('SELECT * FROM User WHERE email=?', params,
				function(err, result) {
					connection.end();
					if( err ) {
						throw ( err );
					} else {
						test.equal(result.length, 1, "Result empty, " + email + " must be present");
						stepTwo();
					}
				}
			);
		});

		var stepTwo = function() {
			userProvider.checkLogin(email, "password", function(result) {
				test.ok(result, "Login failed but should have passed");
				test.done();
			});
		}
	},

	/*
	 * Test that a valid email and invalid password fails
	 */
	testCheckLoginInvalidPassword: function(test) {
		test.expect(2);
		var email = "checkLogin@test.com";
		var params = [ email ];
		mysql.getConnection(function( connection ) {
			connection.query('SELECT * FROM User WHERE email=?', params,
				function(err, result) {
					connection.end();
					if( err ) {
						throw ( err );
					} else {
						test.equal(result.length, 1, "Result empty, " + email + " must be present");
						stepTwo();
					}
				}
			);
		});
		var stepTwo = function() {
			userProvider.checkLogin(email, "passwordfail", function(result) {
				test.ok(!result, "Login passed but should have failed");
				test.done();
			});
		}
	},

	/*
	 * Test that an invalid email and password which is valid for another fails
	 */
	testCheckLoginInvalidEmail: function(test) {
		test.expect(2);
		var email = "checkLogin@shouldnotexist.com";
		var params = [ email ];
		mysql.getConnection(function( connection ) {
			connection.query('SELECT * FROM User WHERE email=?', params,
				function(err, result) {
					connection.end();
					if( err ) {
						throw ( err );
					} else {
						test.equal(result.length, 0, "This email should not exist in the test db");
						stepTwo();
					}
				}
			);
		});
		var stepTwo = function() {
			userProvider.checkLogin(email, "password", function(result) {
				test.ok(!result, "Login passed but should have failed");
				test.done();
			});
		}
	},


};