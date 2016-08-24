# ACME Protocol
[![npm](https://img.shields.io/npm/v/acme-protocol.svg?style=flat-square)](https://npmjs.com/package/acme-protocol)
[![npm license](https://img.shields.io/npm/l/acme-protocol.svg?style=flat-square)](https://npmjs.com/package/acme-protocol)
[![npm downloads](https://img.shields.io/npm/dm/acme-protocol.svg?style=flat-square)](https://npmjs.com/package/acme-protocol)
[![Travis CI status](https://img.shields.io/travis/jhermsmeier/node-acme-protocol.svg?style=flat-square&label=linux)](https://travis-ci.org/jhermsmeier/node-acme-protocol)
[![AppVeyor CI status](https://img.shields.io/appveyor/ci/jhermsmeier/node-acme-protocol/master.svg?style=flat-square&label=windows)](https://ci.appveyor.com/project/jhermsmeier/node-acme-protocol)
[![Dependency Status](https://img.shields.io/david/jhermsmeier/node-acme-protocol.svg?style=flat-square)](https://dependencyci.com/github/jhermsmeier/node-acme-protocol)
[![Code Quality Grade](https://img.shields.io/codacy/grade/890bc62ea4b240f6be8d041dc0cbd1f6/master.svg?style=flat-square&maxAge=2592000)](https://www.codacy.com/app/jhermsmeier/node-acme-protocol)

This module aims to implement the [Automatic Certificate Management Environment (ACME) Protocol](https://github.com/ietf-wg-acme/acme/),
with compatibility for both, the currently employed (e.g. by [LetsEncrypt](https://letsencrypt.org/)), and the currently being specified version.

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save acme-protocol
```

## Index
<!-- MarkdownTOC -->

- [Usage](#usage)
  - [Creating a Client](#creating-a-client)
  - [Registering an Account](#registering-an-account)
  - [Applying for Authorization](#applying-for-authorization)

<!-- /MarkdownTOC -->

## Usage

```js
var ACME = require( 'acme-protocol' )
```

### Creating a Client

```js
// Create a new ACME protocol client
var client = new ACME.Client({
  // ACME service URL
  baseUrl: 'https://acme-staging.api.letsencrypt.org',
  // PEM encoded public key (required)
  publicKey: fs.readFileSync( 'public-key.pem', 'utf8' ),
  // PEM encoded private key (required)
  privateKey: fs.readFileSync( 'private-key.pem', 'utf8' ),
})
```

```js
// Configure the client with the ACME server's directory
// NOTE: Optional, will be done on API if unconfigured
client.configure( function( error, directory ) {
  directory == {
    'new-authz': 'https://acme-staging.api.letsencrypt.org/acme/new-authz',
    'new-cert': 'https://acme-staging.api.letsencrypt.org/acme/new-cert',
    'new-reg': 'https://acme-staging.api.letsencrypt.org/acme/new-reg',
    'revoke-cert': 'https://acme-staging.api.letsencrypt.org/acme/revoke-cert'
  }
})
```

### Registering an Account

```js
// Define your contact details
var contact = [ 'mailto:root@localhost' ]

// Register a new account for defined contact and
// keys the client was initialized with
client.register( contact, function( error, registration ) {
  client.registrationUrl = registration == {
    resource: 'new-reg',
    contact: [ 'mailto:cert-admin@example.com' ],
    id: 246840,
    key: JSONWebKey {
      kty: 'RSA',
      n: 'oL9U7lsMfBGZiFO_NmvTbPlPaMgMfg9iuxO2IkgKrJbKVtrGvfzNCOMIaO_wAx8AIf3-tegeaEWWV6FyO6haW1zPhKovVAYyXQKof8CKvueooTie46d0JAHirdAGWn2BWCQKQ-GlFqqMx2ou1BHv9MxfGKaT9CjT8cIROl1ptag3kdUH5ZsjhGmdg_TNXeu4wtiYVf0JG9nWfZncX4Dgv6IpSCoQiGf6FIE_q0jaUhpdBdQ6HEL_s6O3L45FFYvGfAuiciuKVZugR3hXCUJ26NmShMKfdu5qUKPQ02-IQAFGncnMNOVPeDhkLMMIaNerGCsjVz1l_TjXOSTW-h1paw',
      e: 'AQAB'
    },
    initialIp: '217.246.162.70',
    createdAt: '2016-07-05T22:28:50Z'
  }
})
```

```js
// Create a registration update with `agreement` set
var registration = {
  resource: ACME.REGISTRATION,
  agreement: 'https://letsencrypt.org/documents/LE-SA-v1.0.1-July-27-2015.pdf',
}

// Update your registration with agreement to TOS
client.updateRegistration( registration, function( error, registration ) {
  client.registration = registration == {
    resource: 'new-reg',
    contact: [ 'mailto:cert-admin@example.com' ],
    id: 246840,
    key: JSONWebKey {
      kty: 'RSA',
      n: 'oL9U7lsMfBGZiFO_NmvTbPlPaMgMfg9iuxO2IkgKrJbKVtrGvfzNCOMIaO_wAx8AIf3-tegeaEWWV6FyO6haW1zPhKovVAYyXQKof8CKvueooTie46d0JAHirdAGWn2BWCQKQ-GlFqqMx2ou1BHv9MxfGKaT9CjT8cIROl1ptag3kdUH5ZsjhGmdg_TNXeu4wtiYVf0JG9nWfZncX4Dgv6IpSCoQiGf6FIE_q0jaUhpdBdQ6HEL_s6O3L45FFYvGfAuiciuKVZugR3hXCUJ26NmShMKfdu5qUKPQ02-IQAFGncnMNOVPeDhkLMMIaNerGCsjVz1l_TjXOSTW-h1paw',
      e: 'AQAB'
    },
    agreement: 'https://letsencrypt.org/documents/LE-SA-v1.0.1-July-27-2015.pdf',
    initialIp: '217.246.162.70',
    createdAt: '2016-07-05T22:28:50Z'
  }
})
```

### Applying for Authorization

```js
// Create an Authorization Resource
var auth = {
  resource: ACME.NEW_AUTHORIZATION,
  identifier: {
    type: 'dns',
    value: 'example.com'
  },
}

// Request a new authorization
client.newAuthorization( auth, function( error, authorization ) {
  authorization == {
    identifier: {
      type: 'dns',
      value: 'example.com'
    },
    status: 'pending',
    expires: '2016-08-23T17:01:04.813031251Z',
    challenges: [
      {
        type: 'dns-01',
        status: 'pending',
        uri: 'https://acme-staging.api.letsencrypt.org/acme/challenge/FoNKbCvpWIeWZ1zPag2Y9_RoYS1p_nfp12IGx2HE444/10741622',
        token: 'MCb7GlKjWtYpFiediI1Lxl2eYT1Idswkv6KcoLIu7Eg'
      },
      {
        type: 'tls-sni-01',
        status: 'pending',
        uri: 'https://acme-staging.api.letsencrypt.org/acme/challenge/FoNKbCvpWIeWZ1zPag2Y9_RoYS1p_nfp12IGx2HE444/10741623',
        token: 'q3pTKDKJiqRF9HRYTTiqK6grKmFFNgXXYCH_Ar61IpY'
      },
      {
        type: 'http-01',
        status: 'pending',
        uri: 'https://acme-staging.api.letsencrypt.org/acme/challenge/FoNKbCvpWIeWZ1zPag2Y9_RoYS1p_nfp12IGx2HE444/10741624',
        token: 'gpjesS8JfKGwBx5X6T7RDycRPM9Mxj32xuirCpCbhGU'
      }
    ],
    combinations: [ [ 1 ], [ 0 ], [ 2 ] ]
  }
})
```
