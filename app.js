
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')  // require('./routes')  if this is a folder, read index.js
  , http = require('http')
  , path = require('path');

var app = express();
var server = http.createServer(app)
var io = require('socket.io').listen(server);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');  // use .html
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
app.get('/chat', routes.chat);
app.get('/about', routes.about);
app.get('/message', routes.message);
app.get('/hello', routes.hello);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', {data: 'connected'});

  socket.on('message', function (data) {
      console.log(data);
      socket.broadcast.emit('message', data);
  });
});
