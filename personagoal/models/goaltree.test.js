var GoalTreeProvider = require("./goaltree").GoalTreeProvider;
global.testing = true;
exports.test = function(test) {
	goalTree = new GoalTreeProvider();
	goalTree.getTreeForUser(1, function(err, results) {
		test.equals(err, null);
		test.done();
	});
}