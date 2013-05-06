var MySQL = require('./mysql').MySQL;

var TaskProvider = function(useTestDB) {
	mysql = new MySQL(useTestDB);
	connection = mysql.getConnection();
}

/*
 * Insert into the Task table (title, description) and callback with the insertion id
 */
TaskProvider.prototype.createTask = function(data, callback) {
	var taskInsertParams = [
		data.title,
		data.description
	];
	connection.query('INSERT INTO Task(title, description) VALUES(?, ?)', taskInsertParams,
	function(err, result) {
		//If there was a duplicate entry, alert the callback
		if(err && err.code == 'ER_DUP_ENTRY') {
			callback({task: "duplicate"}, null);
		} else if( err ) {
			callback ( err , null);
		} else {
			callback(null, result.insertId);
		}
	});
}

exports.TaskProvider = TaskProvider;