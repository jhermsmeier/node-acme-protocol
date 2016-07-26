# ACME Protocol
[![npm](https://img.shields.io/npm/v/acme-protocol.svg?style=flat-square)](https://npmjs.com/package/acme-protocol)
[![npm license](https://img.shields.io/npm/l/acme-protocol.svg?style=flat-square)](https://npmjs.com/package/acme-protocol)
[![npm downloads](https://img.shields.io/npm/dm/acme-protocol.svg?style=flat-square)](https://npmjs.com/package/acme-protocol)
[![Travis CI status](https://img.shields.io/travis/jhermsmeier/node-acme-protocol.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-acme-protocol)
[![AppVeyor CI status](https://img.shields.io/appveyor/ci/jhermsmeier/node-acme-protocol/master.svg?style=flat-square)](https://ci.appveyor.com/project/jhermsmeier/node-acme-protocol)
[![Dependency Status](https://dependencyci.com/github/jhermsmeier/node-acme-protocol/badge?style=flat-square)](https://dependencyci.com/github/jhermsmeier/node-acme-protocol)

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
  // client.registrationUrl = registration ->
  //   'https://acme-staging.api.letsencrypt.org/acme/reg/246840'
})
```

```js
// Create a registration update with `agreement` set
// NOTE: The client's `key` will be added to this registration update
// automatically by the client
var registration = {
  resource: ACME.REGISTRATION,
  contact: client.registration.contact.slice(),
  agreement: 'https://letsencrypt.org/documents/LE-SA-v1.0.1-July-27-2015.pdf',
}

// Update your registration with agreement to TOS
client.updateRegistration( registration, function( error, registration ) {
  // client.registration = registration -> {
  //   id: 246840,
  //   key: {
  //     kty: 'RSA',
  //     n: 'oL9U7lsMfBGZiFO_NmvTbPlPaMgMfg9iuxO2IkgKrJbKVtrGvfzNCOMIaO_wAx8AIf3-tegeaEWWV6FyO6haW1zPhKovVAYyXQKof8CKvueooTie46d0JAHirdAGWn2BWCQKQ-GlFqqMx2ou1BHv9MxfGKaT9CjT8cIROl1ptag3kdUH5ZsjhGmdg_TNXeu4wtiYVf0JG9nWfZncX4Dgv6IpSCoQiGf6FIE_q0jaUhpdBdQ6HEL_s6O3L45FFYvGfAuiciuKVZugR3hXCUJ26NmShMKfdu5qUKPQ02-IQAFGncnMNOVPeDhkLMMIaNerGCsjVz1l_TjXOSTW-h1paw',
  //     e: 'AQAB'
  //   },
  //   contact: [ 'mailto:cert-admin@example.com' ],
  //   agreement: 'https://letsencrypt.org/documents/LE-SA-v1.0.1-July-27-2015.pdf',
  //   initialIp: '217.246.162.70',
  //   createdAt: '2016-07-05T22:28:50Z'
  // }
})
```
