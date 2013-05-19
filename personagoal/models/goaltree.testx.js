global.testing = true;
var goalTreeProvider = require("./goaltree");
exports.getOverdueGoalsForUserProject1 = function(test) {
	goalTreeProvider.getOverdueGoalsForUser(1, 1, function(err, results) {
		test.equals(err, null);
		test.equals(results[6].id, 6);
		test.equals(Object.keys(results).length, 1);
		test.done();
	});
}
exports.getOverdueGoalsForUserProject0 = function(test) {
	goalTreeProvider.getOverdueGoalsForUser(1, 0, function(err, results) {
		test.equals(err, null);
		test.equals(results[15].id, 15);
		test.equals(Object.keys(results).length, 1);
		test.done();
	});
}
exports.getTreeForUserProject1 = function(test) {
	goalTreeProvider.getTreeForUser(1, 1, function(err, results) {
		test.equals(results[15], undefined);
		test.equals(results[1].id, 1);
		test.equals(Object.keys(results).length, 1);
		test.done();
	});
}
exports.getTreeForUserProject0 = function(test) {
	goalTreeProvider.getTreeForUser(1, 0, function(err, results) {
		test.equals(results[1], undefined);
		test.equals(results[15].id, 15);
		test.equals(Object.keys(results).length, 1);
		test.done();
	});
}