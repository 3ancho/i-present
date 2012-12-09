var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();
var server = http.createServer(app)
var io = require('socket.io').listen(server);

app.configure(function(){
  app.set('port', process.env.PORT || 3232);
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

/*
var sys = require('sys')
  , http = require("http")
  , ws = require('./node-websocket-server/lib/ws');
*/
var iostat = require('child_process').spawn("iostat", ["1"]);
/*
var httpServer = http.createServer();

var server = ws.createServer({
  debug: true
}, httpServer);
*/
function format (data) {
  var output_data = data.toString();
  console.log(output_data);
  header = 'disk0       cpu     load average'
  if (output_data.match(header)) {
    console.log("ignore header")
  }else{
    // disk0 cpu load 
    // average kbt tps kbs us sy id 1m 5m 15m
    var output_array = output_data.replace(/^\s+|\s+$/g,"").split(/\s+/);
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    console.log(output_array);
    for (var i=0; i < output_array.length; i++) {
      output_array[i] = parseFloat( output_array[i]);
    };
    output_hash = {
        date:new Date(),
      cpu:{
        us:output_array[7],
        id:output_array[12]
      }
    }
    return JSON.stringify(output_hash);
  }
}

app.configure('development', function(){
  app.use(express.errorHandler());
});


// Handle WebSocket Requests
/*
server.addListener("connection", function(conn){
  sys.log("opened connection: "+conn.id);
  server.send(conn.id, "Connected as: "+conn.id);
  iostat.stdout.on('data', function (data) {
    sys.log(typeof(data));
    sys.log('stdout: ' + data);
    sys.log('stdout: ' + format(data));
    server.send(conn.id, format(data));
  });
  server.send(conn.id, "Connected as: "+conn.id);
});

server.addListener("close", function(conn){
  sys.log("closed connection: "+conn.id);
  conn.broadcast("<"+conn.id+"> disconnected");
});
*/

io.sockets.on('connection', function(socket) {
    console.log('Connected by'+ socket.id);
    socket.emit('Connected as:'+socket.id);
    iostat.stdout.on('data', function(data) {
        console.log(typeof(data));
        console.log('stdout: '+ data);
        console.log('stdout: '+ format(data));
        socket.emit('message',{data:format(data)});
    });
});
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
