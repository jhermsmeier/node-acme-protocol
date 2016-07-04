var URL = require( 'url' )
var https = require( 'https' )
var crypto = require( 'crypto' )

/**
 * ACME Protocol
 * @constructor
 * @param {Object} options
 * @return {ACME}
 */
function ACME( options ) {

  if( !(this instanceof ACME) )
    return new ACME( options )

  this.options = Object.assign( {}, ACME.defaults, options )

  if( !this.options.baseUrl || typeof this.options.baseUrl !== 'string' )
    throw new TypeError( 'baseUrl must be a string' )

  this.directory = null

}

/**
 * ACME default options
 * @type {Object}
 */
ACME.defaults = {}

// Resource types
// @see https://ietf-wg-acme.github.io/acme/#rfc.section.5.1
ACME.NEW_REGISTRATION = 'new-reg'
ACME.RECOVER_REGISTRATION = 'recover-reg'
ACME.NEW_AUTHORIZATION = 'new-authz'
ACME.NEW_CERTIFICATE = 'new-cert'
ACME.REVOKE_CERTIFICATE = 'revoke-cert'
ACME.REGISTRATION = 'reg'
ACME.AUTHORIZATION = 'authz'
ACME.CHALLENGE = 'challenge'
ACME.CERTIFICATE = 'cert'

// Error codes
// @see https://ietf-wg-acme.github.io/acme/#rfc.section.5.4
// @see http://tools.ietf.org/html/draft-ietf-appsawg-http-problem-02
ACME.E_BADCSR = ' The CSR is unacceptable (e.g., due to a short key)'
ACME.E_BADNONCE = ' The client sent an unacceptable anti-replay nonce'
ACME.E_CONNECTION = ' The server could not connect to the client for DV'
ACME.E_DNSSEC = ' The server could not validate a DNSSEC signed domain'
ACME.E_MALFORMED = 'The request message was malformed'
ACME.E_SERVERINTERNAL = ' The server experienced an internal error'
ACME.E_TLS = 'The server experienced a TLS error during DV'
ACME.E_UNAUTHORIZED = ' The client lacks sufficient authorization'
ACME.E_UNKNOWNHOST = 'The server could not resolve a domain name'
ACME.E_RATELIMITED = 'The request exceeds a rate limit'

ACME.generateNonce = function( n, callback ) {
  crypto.randomBytes( n, function( error, buffer ) {
    callback( error, buffer ? buffer.toString( 'hex' ) : null )
  })
}

/**
 * ACME prototype
 * @type {Object}
 */
ACME.prototype = {

  constructor: ACME,

  getDirectory: function( callback ) {

    var self = this
    var options = URL.parse( this.options.baseUrl )

    options.method = 'GET'
    options.path = '/directory'

    var req = https.request( options, function( res ) {

      var buffer = ''

      res.setEncoding( 'utf8' )
      res.on( 'readable', function() {
        var chunk = null
        while( chunk = this.read() )
          buffer += chunk
      })

      res.on( 'end', function() {
        var error, data
        try { data = JSON.parse( buffer ) }
        catch( e ) { error = e }
        self.directory = data
        callback( error, data )
      })

    })

    req.on( 'error', callback )
    req.end()

  },

  register: function() {
    // New registration 'new-reg'
  },

  recover: function() {
    // Recover registration 'recover-reg'
  },

  authorize: function() {
    // New authorization 'new-authz'
  },

  getCertificate: function() {
    // New certificate 'new-cert'
  },

  renewCertificate: function() {
    // ...?
  },

  revokeCertificate: function() {
    // Revoke certificate 'revoke-cert'
  },

  getRegistration: function() {
    // NOTE: Unsure about method name
    // Registration 'reg'
  },

  getAuthorization: function() {
    // NOTE: Unsure about method name
    // Authorization 'authz'
  },

  getChallenge: function() {
    // NOTE: Unsure about method name
    // Challenge 'challenge'
  },

}

// Exports
module.exports = ACME
