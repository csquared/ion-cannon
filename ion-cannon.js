var logfmt = require('logfmt'),
    url = require('url'),
    argv = require('optimist').argv;

exports.fire = function(){
  var target_url = url.parse(argv._[0]);

  if(target_url.protocol == 'mqtt:'){
    fire_mqtt(target_url, argv);
  }
}

var fire_mqtt = function(url, options){
  var mqtt = require('mqtt');
  var auth = (url.auth || ':').split(':');
  // Create a client connection
  var client = mqtt.createClient(url.port, url.hostname, {
    username: auth[0],
    password: auth[1]
  });

  var count = 0;

  var chirp = function(){
    var message = 'msg ' + count;
    logfmt.log({
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
