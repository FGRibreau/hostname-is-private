'use strict';

var t = require('chai').assert;
var _ = require('lodash');
var isPrivate = require('./');

var shouldBePrivate = curry1(function (hostname, done) {
  isPrivate(hostname, function (err, isPrivate) {
    t.strictEqual(err, null);
    t.strictEqual(isPrivate, true);
    done();
  })
});

var shouldNotBePrivate = curry1(function (hostname, done) {
  isPrivate(hostname, function (err, isPrivate) {
    t.strictEqual(err, null);
    t.strictEqual(isPrivate, false);
    done();
  })
});


describe('isPrivate', function () {
  ['localhost', '0.0.0.0.xip.io', '127.0.0.1.xip.io', 'dbcontent.cloudapp.net'].forEach(function (hostname) {
    it('should consider ' + hostname + ' private', shouldBePrivate(hostname));
  });

  ['redisgreen.net', 'redsmin.com', 'redislabs.com', 'openredis.com', '8.8.8.8.xip.io'].forEach(function (hostname) {
    it('should not consider ' + hostname + ' private', shouldNotBePrivate(hostname));
  });
});

function curry1(f) {
  return function (a) {
    return function (b) {
      var args = [a].concat(Array.prototype.slice.call(arguments));
      f.apply(null, args);
    };
  };
}
