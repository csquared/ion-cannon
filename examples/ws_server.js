var logfmt = require('logfmt');
var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});

console.log('websockets server listening on port 8080');

wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    logfmt.log({message: message});
  });
  ws.send('something');
});
