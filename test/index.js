var assert = require('assert');



setInterval(function () {
  for (var i = 0; i < 1000000000; i++) {
    'hello world'.split('').map(function (c) {
      console.log(i, c);
    });
  }
}, 10000);