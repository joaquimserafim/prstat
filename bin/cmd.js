#!/usr/bin/env node

var child = require('child_process');
var exec = child.exec;
var spawn = child.spawn;
var help = require('./help');
var format = require('util').format;
var lasync = require('lasync');

// prstat -cmL -p


// tips / questions
// first argument the name of app to monitorizing => --app
// 


function findPID (app, cb) {
  // instead of returning the err we will return 0 when not find a proper process  
  function cb_findPID (err, stdout) {
    if (err) return cb(null, 0);

    var pid = Number(stdout.replace(/\s{2,}|\n/g, ';').split(';').slice(1, 2));
    cb(null, pid);
  }

  exec(format('ps aux | grep \'[%s]%s\'', app.substr(0, 1), app.substr(1)), cb_findPID);
}


function prstat (pid, cb) {
  if (isNaN(pid) || !pid) return cb(new Error('don\'t exist any application running.'));

  var run = spawn('prstat', ['-cL', '-p', pid]);

  run.stdout.on('data', function (data) {
    cb(null, data);
  });

  run.stderr.on('data', function (data) {
    cb(new Error(data));
  });

  run.on('close', function (code) {
    cb(null, code);
  });
}



function main () {
  var args = help.args();

  if (!args.app) return;


  // control flow

  lasync.waterfall([
    function (cb) {
      findPID(args.app, cb);
    },
    function (pid, cb) {
      prstat(pid, cb);
    }], function (err, res) {
      if (err) return console.error(err);

    console.log(res.split(/\n/g));
  });
}


main();