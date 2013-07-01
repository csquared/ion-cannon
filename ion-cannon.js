var logfmt = require('logfmt'),
    url = require('url'),
    cluster = require('cluster'),
    logfmt = require('logfmt'),
    argv = require('optimist').argv,
    numCPUs = require('os').cpus().length;

exports.fire = function(){
  var target_url = url.parse(argv._[0]);

  var fire_func = null;
  if(target_url.protocol == 'mqtt:'){
    fire_func = function(name) { fire_mqtt(name, target_url, argv) };
  }

  var concurrency = parseInt(argv.c || 1);
  var c_per_cpu   = concurrency / numCPUs;

  if(cluster.isMaster){
    logfmt.log({concurrency: concurrency, c_per_cpu:
                c_per_cpu,
                num_cpus: numCPUs})
    for (var i = 0; i < numCPUs && i < concurrency; i++) {
      cluster.fork();
    }
    //get an array of the workers
    var workers = [];
    for(var id in cluster.workers) {
      workers.push(cluster.workers[id])
    }
    //loop over the array to send work
    for(var i = 0; i < concurrency; i++){
      workers[i%numCPUs].send(i);
    }
    cluster.on('exit', function(worker, code, signal) {
      console.log('worker ' + worker.process.pid + ' died');
    });
  }else{
    process.on('message', function(i){
      logfmt.log({worker: cluster.worker.id, i: i})
      fire_func('w' + cluster.worker.id + ':t' + i);
    })
  }
}

var fire_mqtt = function(id, url, options){
  var mqtt = require('mqtt');
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
