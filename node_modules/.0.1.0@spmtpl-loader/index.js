'use strict';

module.exports = function(source) {
  var code = source
    .replace(/\n|\r/g, '')
    .replace(/'/g, '\\\'');
  return 'module.exports = \''+code+'\'';
};
