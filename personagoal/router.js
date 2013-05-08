var register = require('./routes/register');
var login = require('./routes/login');
var home = require('./routes/home');
var loginProvider = require('./models/login');

exports.define = function( app )
{
	/*
	 * These routes are public facing
	 */

	app.all("/register", disallowAuthenticatedUsers);
	app.get("/register", register.index);
	app.post("/register", register.process);

	app.all("/login", disallowAuthenticatedUsers);
	app.get("/login", login.index);
	app.post("/login", login.process);

	/* 
	 * Require all further routes to be logged in or a 401 error is thrown
	 */
	app.all('/user/*', requireAuthentication);

	app.all("/logout", login.logout);
	app.get("/user/home", home.index);
}

var disallowAuthenticatedUsers = function(req, res, next) {
	loginProvider.isLoggedIn(req, function(result) {
	    if(result === false) {
	        next();
	    } else {
	        res.redirect("/user/home");
	    }
	});
}

var requireAuthentication = function(req,res,next) {
	loginProvider.isLoggedIn(req, function(result) {
	    if(result === true) {
	        next();
	    } else {
	       res.redirect("/login");
	    }
	});
}