module.exports.args = function args () {
  var key;
  var obj =  {};

  function cb_handleArgs (arg) {
    if (arg.indexOf('--') === 0) {
      key = arg.replace('--', '');
      return;
    }

    if (key) {
      obj[key] = arg;
      key = '';
    }
  }

  process.argv.forEach(cb_handleArgs);

  return obj;
};