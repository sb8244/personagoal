var goalTreeProvider = require("./goaltree");
exports.test = function(test) {
	goalTreeProvider.getTreeForUser(1, function(err, results) {
		test.equals(err, null);
		var util = require('util');

		console.log(util.inspect(results, false, null));
		test.done();
	});
}