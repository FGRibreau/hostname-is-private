'use strict';
var ip = require('ip');
var dns = require('dns');
var publicIp = require('public-ip');
var _ = require('lodash');

/**
 * Check whether or not an hostname refers to a private IP
 * @param  {String} hostname
 * @param  {Function} f(err: {error,null}, isPrivate: {boolean})
 */
var isPrivate = _.curry(function (checker, hostname, f) {
  try {
    dns.resolve(hostname, function (err, addresses) {
      if (err) {
        return setImmediate(f, err);
      }

      return checker(addresses, f);
    });
  } catch (err) {
    setImmediate(f, err);
  }
});

function IPisPrivate(ipAddr) {
  return ipAddr === '0.0.0.0' || ip.isPrivate(ipAddr);
}

/**
 * @param  {Array} addresses array of ip addr
 * @param  {Function} f(err, isPrivate) isPrivate will be `true` if at least one addr is private
 */
function checkIfAddressesArePrivate(addresses, f) {
  setImmediate(f, null, addresses.some(IPisPrivate));
}

/**
 * @param  {Array} addresses array of ip addr
 * @param  {Function} f(err, isPrivate) isPrivate will be `true` if at least one addr is private or is the public server IP
 */
function checkIfAddressesArePrivateIncludingPublicIp(addresses, f) {
  checkIfAddressesArePrivate(addresses, function (err, isPrivate) {
    if (err) {
      return setImmediate(f, err);
    }


    if (isPrivate === true) {
      // no need to check further, the IP is private
      return setImmediate(f, null, isPrivate);
    }

    // retrieve the Public IP
    getPublicIP(function (err, publicIp) {
      if (err) {
        return setImmediate(f, err);
      }

      f(null, addresses.some(function (ip) {
        return ip === publicIp;
      }));
    });
  });
}

function getPublicIP(f) {
  if (getPublicIP.PUBLIC_IP) {
    return f(null, getPublicIP.PUBLIC_IP);
  }

  publicIp(function (err, ip) {
    if (err) {
      return f(err);
    }

    getPublicIP.PUBLIC_IP = ip;
    getPublicIP(f);
  });
}

getPublicIP.PUBLIC_IP = null;

module.exports = {
  isPrivate: isPrivate(checkIfAddressesArePrivate),
  isPrivateIncludingPublicIp: isPrivate(checkIfAddressesArePrivateIncludingPublicIp)
};
