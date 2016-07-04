var ACME = require( '../' )
var URL = require( 'url' )
var https = require( 'https' )
var crypto = require( 'crypto' )
var info = require( '../package.json' )

/**
 * ACME Protocol Client
 * @constructor
 * @param {Object} options
 * @return {Client}
 */
function Client( options ) {

  if( !(this instanceof Client) )
    return new Client( options )

  this.options = Object.assign( {}, Client.defaults, options )

  if( !this.options.baseUrl || typeof this.options.baseUrl !== 'string' )
    throw new TypeError( 'baseUrl must be a string' )

  this.directory = null

}

/**
 * Client default options
 * @type {Object}
 */
Client.defaults = {
  baseUrl: null,
  privateKey: null,
  publicKey: null,
  userAgent: process.release.name + '/' + process.versions.node +
    ' ' + info.name + '/' + info.version,
}

/**
 * Client prototype
 * @type {Object}
 */
Client.prototype = {

  constructor: Client,

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
module.exports = Client
