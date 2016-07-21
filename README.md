# ACME Protocol
[![npm](https://img.shields.io/npm/v/acme-protocol.svg?style=flat-square)](https://npmjs.com/package/acme-protocol)
[![npm license](https://img.shields.io/npm/l/acme-protocol.svg?style=flat-square)](https://npmjs.com/package/acme-protocol)
[![npm downloads](https://img.shields.io/npm/dm/acme-protocol.svg?style=flat-square)](https://npmjs.com/package/acme-protocol)
[![build status](https://img.shields.io/travis/jhermsmeier/node-acme-protocol.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-acme-protocol)

This module aims to implement the [Automatic Certificate Management Environment (ACME) Protocol](https://github.com/ietf-wg-acme/acme/),
with compatibility for both, the currently employed (e.g. by LetsEncrypt), and the currently being specified version.

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save acme-protocol
```

## Usage

```js
var ACME = require( 'acme-protocol' )
```

```js
// Create a new ACME protocol client
var client = new ACME({
  baseUrl: 'https://acme-staging.api.letsencrypt.org',
  publicKey: '...', // PEM encoded public key (required)
  privateKey: '...', // PEM encoded private key (required)
})
```

```js
// Configure the client with the ACME server's directory
// NOTE: Optional, will be done on API if unconfigured
client.configure( function( error, directory ) {
  // directory -> {
  //   'new-authz': 'https://acme-staging.api.letsencrypt.org/acme/new-authz',
  //   'new-cert': 'https://acme-staging.api.letsencrypt.org/acme/new-cert',
  //   'new-reg': 'https://acme-staging.api.letsencrypt.org/acme/new-reg',
  //   'revoke-cert': 'https://acme-staging.api.letsencrypt.org/acme/revoke-cert'
  // }
})
```

```js
// Retrieve a new replay-nonce to be used
client.getNonce( function( error, replayNonce ) {
  // ...
})
```

```js
// Define your contact details
var contact = [ 'mailto:root@localhost' ]

// Register a new account for defined contact and
// keys the client was initialized with
client.register( contact, function( error, registration ) {
  // registration -> 'https://acme-staging.api.letsencrypt.org/acme/reg/246840'
})
```
