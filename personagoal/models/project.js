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

/*
 * All functions until otherwise noted require authorization
 */

var authorizeUserOnProject = function(user_id, project_id, callback) {
	var checkParams = [	user_id, project_id ];
	mysql.getConnection(function( connection ) {
		connection.query('SELECT * FROM User_Project WHERE user_id = ? AND project_id = ?', checkParams,
		function(err, result) {
			connection.end();
			if(err) return callback(false);
			else return callback(result.length == 1);
		});
	});
}

exports.setDescription = function(project_id, text, user_id, callback) {
	authorizeUserOnProject(user_id, project_id, function(result) {
		if(result === false) return callback({err: "not allowed"}, null);
		var params = [
			text,
			project_id
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
	});
}

/*
 * TODO: How to handle auth on this function
 */
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


exports.deleteProject = function(project_id, user_id, callback) {
	authorizeUserOnProject(user_id, project_id, function(result) {
		if(result === false) return callback({err: "not allowed"}, null);
		var deleteGoalQuery = "DELETE FROM Task WHERE task_id IN (SELECT task_id FROM Goal NATURAL JOIN Goal_Project WHERE project_id=?)";
		var deleteProjectQuery = "DELETE FROM Project WHERE project_id = ?";
		var params = [project_id];
		var checkParams = [	user_id, project_id ];
		mysql.getConnection(function( connection ) {
			connection.query(deleteGoalQuery, params, function( err, result) {
				if(err) {
					return callback(err, null);
				} else {
					connection.query(deleteProjectQuery, params, function( err, result) {
						connection.end();
						if(err) {
							return callback(err, null);
						} else {
							return callback(null, true);
						}
					});
				}
			});
		});
	});
}
