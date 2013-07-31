var logfmt = require('logfmt'),
    url = require('url'),
    cluster = require('cluster'),
    logfmt = require('logfmt'),
    argv = require('optimist').argv,
    numCPUs = require('os').cpus().length;

var fire_mqtt = require('./lib/mqtt');
var fire_ws = require('./lib/ws');

exports.fire = function(){
  if(!argv._[0] || argv.h || argv.help){
    console.log("usage: \n\t ion-cannon <url> [-c concurrency] [-i/--interval milliseconds]");
    process.exit(0);
  }

  var target_url = url.parse(argv._[0]);

  var fire_func = null;
  if(target_url.protocol == 'mqtt:'){
    fire_func = function(name) { fire_mqtt(name, target_url, argv) };
  }else if(target_url.protocol == 'ws:'){
    fire_func = function(name) { fire_ws(name, target_url, argv) };
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

