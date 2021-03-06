
/**
 * Module dependencies.
 */

global.testing = false;
global.debug = false;
//global.user_id = 1;
var router = require("./router");
var express = require('express')
  , http = require('http')
  , path = require('path')
  , expressValidator = require('express-validator');

var app = express();
app.set('env', 'development');

// all environments

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { pretty: true });
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(expressValidator);
  app.use(express.cookieParser('personagoal-secret-word'));
  app.use(express.session());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.locals.pretty = true;
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
router.define(app);

process.on('uncaughtException', function (err) {
	console.log(err.stack);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
