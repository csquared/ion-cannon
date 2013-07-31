var mqtt = require('mqtt');

exports = module.exports = function(id, url, options){
  var auth = (url.auth || ':').split(':');
  // Create a client connection
  var client = mqtt.createClient(url.port, url.hostname, {
    username: auth[0],
    password: auth[1]
  });

  var count = 0;

  var chirp = function(){
    var message = 'hello from ' + id + ':' + count;
    logfmt.log({
      id: id,
      mqtt: true,
      i: count,
      topic: 'messages',
      message: message
    })
    client.publish('messages', message);
    count++;
  }

  setInterval(chirp, options.i || options.interval || 1000)
}
