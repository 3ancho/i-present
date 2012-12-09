
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
app.get('/admin', routes.admin);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

client_count = 0;

io.sockets.on('connection', function (socket) {
  client_count = io.sockets.clients().length 
  socket.emit('news', {content: 'connected', clients: client_count});
  socket.broadcast.emit('client_count_update', {clients: client_count});

  socket.on('message', function (data) {
    console.log(data);
    socket.broadcast.emit('message', {name: data.nickname, content: data.content});
  });

  socket.on('change_slide', function(data) {
    console.log('change slide to ' + data)
    socket.broadcast.emit('client_change_slide', data);
  });

  socket.on('disconnect', function () {
    setTimeout(function() {client_count = io.sockets.clients().length;}, 10000);
    socket.broadcast.emit('client_count_update', {clients: client_count});
    console.log(client_count);
  })

});

