var WebSocket = require('ws');

exports = module.exports = function(id, url, options){
  var ws = new WebSocket(url);

  var count = 0;

  ws.on('open', function(){

    var chirp = function(){
      var message = 'hello from ' + id + ':' + count;
      logfmt.log({
        id: id,
        ws: true,
        i: count,
        topic: 'messages',
        message: message
      })
      ws.send(message);
      count++;
    }

    setInterval(chirp, options.i || options.interval || 1000)
  })
}

