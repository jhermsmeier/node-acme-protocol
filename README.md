# ACME Protocol
[![npm](http://img.shields.io/npm/v/acme-protocol.svg?style=flat-square)](https://npmjs.com/acme-protocol)
[![npm](http://img.shields.io/npm/l/acme-protocol.svg?style=flat-square)](https://npmjs.com/acme-protocol)
[![npm downloads](http://img.shields.io/npm/dm/acme-protocol.svg?style=flat-square)](https://npmjs.com/acme-protocol)
[![build status](http://img.shields.io/travis/jhermsmeier/node-acme-protocol.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-acme-protocol)

## Install via [npm](https://npmjs.com)

```sh
$ npm install acme-protocol
```

## Usage

```js
var ACME = require( 'acme-protocol' )
```

```js
var client = new ACME({
  baseUrl: 'https://acme-staging.api.letsencrypt.org'
})
```

```js
client.getDirectory( function( error, data ) {
  // data -> {
  //   'new-authz': 'https://acme-staging.api.letsencrypt.org/acme/new-authz',
  //   'new-cert': 'https://acme-staging.api.letsencrypt.org/acme/new-cert',
  //   'new-reg': 'https://acme-staging.api.letsencrypt.org/acme/new-reg',
  //   'revoke-cert': 'https://acme-staging.api.letsencrypt.org/acme/revoke-cert'
  // }
})
```
