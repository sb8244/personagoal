var mysql = require('./mysql');


exports.createNewUser = function(data, callback)
{
	//Set the parameters for the user insertion
	var userInsertParams = [
		data.email
	];
	//insert the user (just email) into the User table, it is normalized
	//and this table must be populated first
	mysql.getConnection(function( connection ) {
		connection.query('INSERT INTO User(email) VALUES(?)', userInsertParams,
			function(err, result) {
				connection.end();
				//If there was a duplicate entry, alert the callback
				if(err && err.code == 'ER_DUP_ENTRY') {
					return callback({email: "duplicate"}, null);
				} else if( err ) {
					return callback ( err , null );
				} else {
					return regQueryCallbacks(data, callback, result.insertId);
				}
			}
		);
	});
	
	//This should happen AFTER the first insertion query
	var regQueryCallbacks = function ( data, callback, user_id ) {
		var crypto = require('crypto');
		var crypt = crypto.createHash('md5').update(data.password).digest("hex");
		var userPasswordParams = [
			user_id,
			crypt
		];
		mysql.getConnection(function( connection ) {
			connection.query('INSERT INTO User_Password VALUES(?, ?)', userPasswordParams,
				function(err, result) {
					connection.end();
					if( err ) throw err;
					regQueryFinal(callback, user_id);
				}
			);
		});
		
		var userDetailParams = [
			user_id,
			data.name,
			data.role
		];
		mysql.getConnection(function( connection ) {
			connection.query('INSERT into User_Detail (user_id, name, role) values(?,?,?)', userDetailParams,
				function(err, result) {
					connection.end();
					if( err ) throw err;
					regQueryFinal(callback, user_id);
				}
			);
		});
	}

	/* 
	 * Used to handle the callbacks for the insertion query
	 */
	var queryCount = 0;
	var regQueryFinal = function(callback, user_id) {
		queryCount ++;
		if(queryCount == 2)
		{
			return callback(null, user_id);
		}
	}
}

exports.removeUser = function(user_id, callback) {
	var params = [
		user_id
	];
	mysql.getConnection(function( connection ) {
		connection.query('DELETE FROM User WHERE user_id = ?', params,
		function(err, result) {
			connection.end();
			//If there was a duplicate entry, alert the callback
			if(err) {
				return callback ( err , null);
			} else {
				return callback(null, true);
			}
		});
	});
}

exports.checkLogin = function(email, password, callback) {
	var crypto = require('crypto');
	var cryptPass = crypto.createHash('md5').update(password).digest("hex");
	var sqlStatement = 'SELECT * FROM User NATURAL JOIN User_Password WHERE email=? AND password=?';
	var params = [ email, cryptPass ];
	mysql.getConnection(function( connection ) {
		connection.query(sqlStatement, params,
			function(err, result) {
				connection.end();
				if( err ) return callback(false);
				else if(result.length === 0) return callback(false);
				else if(result.length === 1) return callback(result[0].user_id);
			}
		);
	});
}