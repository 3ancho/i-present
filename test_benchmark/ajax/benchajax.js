var http = require('http');
var message = "o bispo de constantinopla nao quer se desconstantinopolizar";

function user(host, port) {
  var options = {
    host: host,
    port: port,
    path: '/',
    method: 'POST'
  };

  var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  // write data to request body
  req.write(message);
  req.end();
};

var argvIndex = 2;

var users = parseInt(process.argv[argvIndex++]);
var rampUpTime = parseInt(process.argv[argvIndex++]) * 1000; // in seconds
var newUserTimeout = rampUpTime / users;
var host = process.argv[argvIndex++] ? process.argv[argvIndex - 1]  : 'localhost';
var port = process.argv[argvIndex++] ? process.argv[argvIndex - 1]  : '3000';

for(var i=0; i<users; i++) {
  setTimeout(function() { user(host, port); }, i * newUserTimeout);
};
