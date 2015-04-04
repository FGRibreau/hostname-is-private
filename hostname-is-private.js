'use strict';
var ip = require('ip');
var dns = require('dns');

/**
 * Check whether or not an hostname refers to a private IP
 * @param  {String} hostname
 * @param  {Function} f(err: {error,null}, isPrivate: {boolean})
 */
module.exports = function isPrivate(hostname, f) {
  try {
    dns.resolve(hostname, function (err, addresses) {
      if (err) {
        return setImmediate(f, err);
      }

      return setImmediate(f, null, addresses.every(IPisPrivate));
    });
  } catch (err) {
    setImmediate(f, err);
  }
};

function IPisPrivate(ipAddr) {
  return ipAddr === '0.0.0.0' || ip.isPrivate(ipAddr);
}
