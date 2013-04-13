var register = require('./routes/register');

exports.define = function( app )
{
	app.get("/register", register.index);
	app.post("/register", register.process);
}