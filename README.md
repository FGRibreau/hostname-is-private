# hostname-is-private [![Build Status](https://drone.io/github.com/FGRibreau/hostname-is-private/status.png)](https://drone.io/github.com/FGRibreau/hostname-is-private/latest)


> Check whether or not an hostname refers to a private IP

## Setup

```shell
npm install hostname-is-private
```

<p align="center">
<a target="_blank" href="https://play.spotify.com/track/5vrwlyErg2E1bnDVLH5GhH"><img style="width:100%" src="https://cloud.githubusercontent.com/assets/138050/6993821/c4e023a6-db01-11e4-85aa-840078efe431.gif"></a>
</p>

## Usage

```javascript
var isPrivate = require('hostname-is-private');

isPrivate('127.0.0.1.xip.io', function(err, isPrivate){
    console.log(err === null, isPrivate == true);
});

isPrivate('localhost', function(err, isPrivate){
    console.log(err === null, isPrivate === true);
});

isPrivate('google.com', function(err, isPrivate){
    console.log(err === null, isPrivate === false);
});
```

## How it works

It uses [dns.resolve](https://nodejs.org/api/all.html#all_dns_resolve_hostname_rrtype_callback) underneath and [ip.isPrivate](https://github.com/indutny/node-ip#ip) to check if the resolved IP is private (or not).
