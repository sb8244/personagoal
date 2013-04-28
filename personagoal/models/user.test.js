var UserProvider = require("./user").UserProvider;
var MySQL = require('./mysql').MySQL;
var testEmail = "testRegister@test.com";
exports.testRegister = {
	/*
	 * We should clean up our test so we can test some mores
	 */
	tearDown: function(callback){
		mysql = new MySQL(true);
		connection = mysql.getConnection();
		params = [testEmail];
		connection.query('DELETE FROM User WHERE email=?', params, function() {
			callback();
		});
	},
	/*
	 * Tests the registration function in the UserProvider
	 *
	 * Checks the normalization across tables
	 */
	testRegister: function(test) {
		test.expect(10);
		var userProvider = new UserProvider(true);
		mysql = new MySQL(true);
		connection = mysql.getConnection();
		params = [testEmail];
		connection.query('SELECT * FROM User WHERE email=?', params,
			function(err, result) {
				if( err ) {
					throw ( err );
				} else {
					test.equal(result.length, 0, "Result not empty");
					stepTwo();
				}
			}
		);

		var stepTwo = function() {
			insertParams = {
				name: "testRegister",
				role: "tester",
				email: testEmail,
				password: "password"
			};
			userProvider.createNewUser(insertParams, function(err, id) {
				connection.query('SELECT * FROM User WHERE email=?', params, function(err, result) {
					if( err ) {
						throw ( err );
					} else {
						test.equal(result.length, 1, "Result empty");
						test.equal(result[0].email, insertParams.email, "Email not equal");
						test.equal(result[0].user_id, id, "ID isn't matching up");
						stepCall();
					}
				});
				connection.query('SELECT * FROM User_Detail WHERE user_id=?', [id], function(err, result) {
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
				connection.query('SELECT * FROM User_Password WHERE user_id=?', [id], function(err, result) {
					if( err ) {
						throw ( err );
					} else {
						test.equal(result.length, 1, "Result empty");
						test.equal(result[0].password, '5f4dcc3b5aa765d61d8327deb882cf99', "Password-md5 not equal");
						stepCall();
					}
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