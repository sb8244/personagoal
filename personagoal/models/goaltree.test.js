var goalTreeProvider = require("./goaltree");
exports.test = function(test) {
	goalTreeProvider.getTreeForUser(1, function(err, results) {
		test.equals(err, null);
		test.done();
	});
}