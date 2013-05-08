exports.index = function(req, res) {
	var goalTreeProvider = require("../models/goaltree");
	var user_id = req.session.user_id;
	goalTreeProvider.getTreeForUser(user_id, function(err, tree) {
		console.log(tree);
		res.render('home', {
			title: 'Home',
			goaltree: tree
		});
	});
}