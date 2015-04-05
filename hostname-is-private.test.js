'use strict';

var t = require('chai').assert;
var _ = require('lodash');
var publicIp = require('public-ip');

var isPrivate = require('./').isPrivate;
var isPrivateIncludingPublicIp = require('./').isPrivateIncludingPublicIp;

var shouldBePrivate = curry1(function (hostname, done) {
  isPrivate(hostname, function (err, isPrivate) {
    t.strictEqual(err, null);
    t.strictEqual(isPrivate, true);
    done();
  });
});

var shouldNotBePrivate = curry1(function (hostname, done) {
  isPrivate(hostname, function (err, isPrivate) {
    t.strictEqual(err, null);
    t.strictEqual(isPrivate, false);
    done();
  });
});


describe('isPrivate', function () {
  ['0.0.0.0.xip.io', '127.0.0.1.xip.io', 'dbcontent.cloudapp.net', '127.0.0.1'].forEach(function (hostname) {
    it('should consider ' + hostname + ' private', shouldBePrivate(hostname));
  });

  ['redisgreen.net', 'redsmin.com', 'redislabs.com', 'openredis.com', '8.8.8.8.xip.io', '8.8.8.8'].forEach(function (hostname) {
    it('should not consider ' + hostname + ' private', shouldNotBePrivate(hostname));
  });
});

describe('.isPrivateIncludingPublicIp', function () {
  it('should consider specified public IP as private too', function (done) {
    publicIp(function (err, ip) {
      t.strictEqual(err, null);
      isPrivateIncludingPublicIp(ip + '.xip.io', function (err, isPrivate) {
        t.strictEqual(err, null);
        t.strictEqual(isPrivate, true);
        done();
      });
    });
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
