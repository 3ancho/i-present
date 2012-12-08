
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')  // require('./routes')  if this is a folder, read index.js
//  , user = require('./routes/user')  // read ./routes/user.js
  , http = require('http')
  , path = require('path');

var app = express();
var server = http.createServer(app)

app.configure(function(){
  app.set('port', process.env.PORT || 4000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');  // use .html
//  app.engine('html', require('jade').__express); // use .html
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.home);

// old -start script
//http.createServer(app).listen(app.get('port'), function(){
//  console.log("Express server listening on port " + app.get('port'));
//});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
