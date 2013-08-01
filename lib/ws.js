var WebSocket = require('ws');

exports = module.exports = function(id, url, options){
  var interval = null;

  var connect = function(){
    var ws = new WebSocket(url);
    var count = 0;
    if(interval) clearInterval(interval);

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
        ws.send(message, function(error){
          if(error) connect();
        });
        count++;
      }

      interval = setInterval(chirp, options.i || options.interval || 1000)
    })

    ws.on('error', function(){
      connect();
    })
  }

  connect();
}
