'use strict';

var readFile = require('fs').readFileSync;
var exists = require('fs').existsSync;
var join = require('path').join;
var spmrc = require('spmrc');
var extend = require('extend');
var mixarg = require('mixarg');

var defaults = {
  // registry url of yuan server
  registry: spmrc.get('registry'),
  // global registry, others are private
  global_registry: 'http://spmjs.io',
  // an HTTP proxy, pass to request
  proxy: spmrc.get('proxy'),
  // the authKey that copied from spmjs accout page
  auth: spmrc.get('auth'),
  // the temp directory
  temp: spmrc.get('user.temp'),
  // cache directory
  cache: join(spmrc.get('user.home'), '.spm', 'cache')
};

module.exports = function(cwd, opts) {
  cwd = cwd || process.cwd();
  opts = opts || {};
  var pkgArgs = getPkgArgs(cwd, opts.pkg);
  return extend.apply(null, [true, {}, defaults, pkgArgs].concat(opts.merge));
};

function getPkgArgs(cwd, pkg) {
  if (!pkg) {
    var pkgPath = join(cwd, 'package.json');
    if (!exists(pkgPath)) return {};
    pkg = JSON.parse(readFile(pkgPath));
  }
  if (!pkg.spm) return {};

  var buildArgs = mixarg(pkg.spm.buildArgs);
  buildArgs.global = getGlobal(buildArgs.global);

  var ret = {
    registry: pkg.spm.registry,
    build: extend(buildArgs, pkg.spm.build),
    server: pkg.spm.server || {},
    scripts: pkg.spm.scripts || {}
  };

  // 兼容之前的 build 配置
  [
    'extractCSS', 'common', 'babel', 'uglify', 'hash', 'dest', 'less',
    'autoprefixer', 'umd', 'pathmap'
  ].forEach(function(key) {
    if (pkg.spm.hasOwnProperty(key)) {
      ret.build[key] = pkg.spm[key];
    }
  });

  return ret;
}

function getGlobal(str) {
  if (typeof str !== 'string') return {};

  var ret = {};
  str.split(/\s*,\s*/).forEach(function(item) {
    var m = item.split(':');
    ret[m[0]] = m[1];
  });
  return ret;
}
