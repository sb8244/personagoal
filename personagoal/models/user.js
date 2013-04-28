var MySQL = require('./mysql').MySQL;

var UserProvider = function() {
	mysql = new MySQL();
	console.log(mysql);
	connection = mysql.getConnection();
}

UserProvider.prototype.createNewUser = function(data, callback)
{
	//Set the parameters for the user insertion
	var userInsertParams = [
		data.email
	];
	//insert the user (just email) into the User table, it is normalized
	//and this table must be populated first
	connection.query('INSERT INTO User(email) VALUES(?)', userInsertParams,
		function(err, result) {
			//If there was a duplicate entry, alert the router
			if(err && err.code == 'ER_DUP_ENTRY') {
				callback({email: "duplicate"}, null);
			} else if( err ) {
				throw ( err );
			} else {
				regQueryCallbacks(data, callback, result.insertId);
			}
		}
	);
}

//This should happen AFTER the first insertion query
var regQueryCallbacks = function ( data, callback, user_id ) {
	var crypto = require('crypto');
	var crypt = crypto.createHash('md5').update(data.password).digest("hex");
	var userPasswordParams = [
		user_id,
		crypt
	];
	connection.query('INSERT INTO User_Password VALUES(?, ?)', userPasswordParams,
		function(err, result) {
			if( err ) throw err;
			regQueryFinal(callback, user_id);
		}
	);
	
	var userDetailParams = [
		user_id,
		data.name,
		data.role
	];
	connection.query('INSERT into User_Detail (user_id, name, role) values(?,?,?)', userDetailParams,
		function(err, result) {
			if( err ) throw err;
			regQueryFinal(callback, user_id);
		}
	);
	connection.end();
}

/* 
 * Used to handle the callbacks for the insertion query
 */
var queryCount = 0;
var regQueryFinal = function(callback, user_id) {
	queryCount ++;
	if(queryCount == 2)
	{
		callback(null, user_id);
	}
}


exports.UserProvider = UserProvider;