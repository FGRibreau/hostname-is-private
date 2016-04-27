'use strict';

var t = require('chai').assert;
var _ = require('lodash');
var publicIp = require('public-ip');

var isPrivate = require('./').isPrivate;
var isPrivateIncludingPublicIp = require('./').isPrivateIncludingPublicIp;

var isPrivateWithHostname = _.curry(function (isPrivateCheck, shouldYieldError) {
  return curry1(function (hostname, done) {
    isPrivate(hostname, function (err, _isPrivate) {
      t.strictEqual(err ? err.toString() : err, shouldYieldError);
      t.strictEqual(_isPrivate, isPrivateCheck);
      done();
    });
  });
});

var shouldBePrivate = isPrivateWithHostname(true, null);
var shouldNotBePrivate = isPrivateWithHostname(false, null);
var shouldNotBeAbleToResolve = isPrivateWithHostname(undefined);

describe('isPrivate', function () {
  ['0.0.0.0.xip.io', '192.168.10.8', '127.0.0.1.xip.io', '10.0.0.45', 'dbcontent.cloudapp.net', '127.0.0.1'].forEach(function (hostname) {
    it('should consider ' + hostname + ' private', shouldBePrivate(hostname));
  });

  ['redisgreen.net', 'redsmin.com', 'redislabs.com', 'openredis.com', '8.8.8.8.xip.io', '8.8.8.8', '140.142.123.62'].forEach(function (hostname) {
    it('should not consider ' + hostname + ' private', shouldNotBePrivate(hostname));
  });

  [{
    hostname: 'plop.use1.cache.amazonaws.com',
    err: 'Error: getaddrinfo ENOTFOUND plop.use1.cache.amazonaws.com'
  }, {
    hostname: 'plop.plop.0001.plop.cache.amazonaws.com',
    err: 'Error: getaddrinfo ENOTFOUND plop.plop.0001.plop.cache.amazonaws.com'
  }].forEach(function (test) {
    it('should not be able to resolve ' + test.hostname, shouldNotBeAbleToResolve(test.err)(test.hostname));
  });

  describe('when passing ip addresses', function () {
    var oldLookup = _.noop;
    var dns = require('dns');

    beforeEach(function () {
      oldLookup = dns.lookup;
      dns.lookup = function () {
        throw new Error('should not be called');
      };
    });

    afterEach(function () {
      dns.lookup = oldLookup;
    });

    ['8.8.8.8', '140.142.123.62'].forEach(function (hostname) {
      it('should not consider ' + hostname + ' private', shouldNotBePrivate(hostname));
    });
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
