var mysql = require('./mysql');
var async = require('async');

exports.createProject = function(name, callback) {
	var params = [
		name
	];
	mysql.getConnection(function( connection ) {
		connection.query('INSERT INTO Project(title) VALUES(?)', params,
		function(err, result) {
			connection.end();
			//If there was a duplicate entry, alert the callback
			if(err && err.code == 'ER_DUP_ENTRY') {
				return callback({err: "duplicate"}, null);
			} else if( err ) {
				return callback ( err , null);
			} else {
				return callback(null, result.insertId);
			}
		});
	});
}

exports.setDescription = function(id, text, callback) {
	var params = [
		text,
		id
	]
	mysql.getConnection(function( connection ) {
		connection.query('UPDATE Project SET description = ? WHERE project_id = ?', params,
		function(err, result) {
			connection.end();
			if( err ) {
				return callback ( err , null);
			} else if(result.affectedRows == 0) {
				return callback(null, false);
			} else {
				return callback(null, true);
			}
		});
	});
}

exports.linkUserToProject = function(user_id, project_id, callback) {
	var params = [
		user_id,
		project_id
	]
	mysql.getConnection(function( connection ) {
		connection.query('INSERT INTO User_Project VALUES(?,?)', params,
		function(err, result) {
			connection.end();
			if( err ) {
				return callback ( err , null);
			} else {
				return callback(null, true);
			}
		});
	});
}

exports.getProjectsForUser = function(user_id, callback) {
	var params = [
		user_id
	]
	mysql.getConnection(function( connection ) {
		connection.query('SELECT * FROM User_Project NATURAL JOIN Project WHERE user_id = ?', params,
		function(err, result) {
			connection.end();
			if( err ) {
				return callback ( err , null);
			} else {
				return callback(null, result);
			}
		});
	});
}