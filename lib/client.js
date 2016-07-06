var ACME = require( '../' )
var URL = require( 'url' )
var request = require( 'request' )
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

  this._request = request.defaults({
    gzip: true,
    json: true,
    baseUrl: this.options.baseUrl,
    headers: {
      'User-Agent': this.options.userAgent,
      'Connection': 'Keep-Alive',
    },
  })

}

/**
 * Client default options
 * @type {Object}
 */
Client.defaults = {
  baseUrl: null,
  directoryPath: 'directory',
  privateKey: null,
  publicKey: null,
  userAgent: process.release.name + '/' + process.versions.node +
    ' ' + info.name + '/' + info.version,
}

/**
 * Build a detailed error from a problem response
 * @param  {Error} error
 * @param  {Object} response
 * @param  {Object} body
 * @return {Error}
 */
Client.getResponseError = function( error, response, body ) {

  var error = new Error( response.statusMessage )
  error.detail = body

  if( response.headers['content-type'] === 'application/problem+json' ) {
    var errorType = body.type.replace( 'urn:acme:error:', '' ).toUpperCase()
    error.message = ACME[ 'E_' + errorType ] + ': ' + body.detail
    error.code = body.status
  }

  return error

}

/**
 * Client prototype
 * @type {Object}
 */
Client.prototype = {

  constructor: Client,

  get isConfigured() {
    return this.directory != null
  },

  hasCapability: function( capability ) {
    return !!this.directory[ capability ]
  },

  configure: function(/* [path,] callback */) {

    var self = this
    var argv = Array.prototype.slice.call( arguments )
    var callback = argv.pop()
    var path = this.options.directoryPath = argv.pop() ||
      this.options.directoryPath

    return this._request.get( path, function( error, response, body ) {

      if( error ) return callback.call( self, error, body );

      if( response.statusCode !== 200 ) {
        error = Client.getResponseError( error, response, body )
      }

      self.directory = body
      callback.call( self, error, self.directory )

    })

  },

}

// Exports
module.exports = Client
