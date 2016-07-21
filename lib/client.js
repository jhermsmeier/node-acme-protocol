var ACME = require( '../' )
var URL = require( 'url' )
var base64Url = require( 'base64-url' )
var JSONWebAlgorithms = require( 'json-web-algorithms' )
var JSONWebKey = require( 'json-web-key' )
var request = require( 'request' )
var info = require( '../package.json' )
var debug = require( 'debug' )( 'acme:client' )

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

  /** @type {Object} ACME Directory */
  this.directory = null

  this._replayNonce = null

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
    error.message = body.detail || ACME.ERROR[ errorType ]
    Object.assign( error, body )
  }

  return error

}

/**
 * Client prototype
 * @type {Object}
 */
Client.prototype = {

  constructor: Client,

  /** @type {Boolean} isConfigured */
  get isConfigured() {
    return this.directory != null
  },

  /**
   * Check whether the client has a certain capability,
   * e.g. supports new registartions via `.hasCapability('new-reg')`
   * @param  {String}  capability
   * @return {Boolean}
   */
  hasCapability: function( capability ) {
    return !!this.directory[ capability ]
  },

  /**
   * Configure the client directory from a given path / URL
   * @param {String} [path] URL
   * @param {Function} callback
   */
  configure: function(/* [path,] callback */) {

    var self = this
    var argv = Array.prototype.slice.call( arguments )
    var callback = argv.pop()
    var path = this.options.directoryPath = argv.pop() ||
      this.options.directoryPath

    this._request.get( path, function( error, response, body ) {

      if( error ) return callback.call( self, error, body );

      if( response.statusCode < 200 || response.statusCode >= 300 ) {
        error = Client.getResponseError( error, response, body )
      }

      debug( 'configure:response:headers', response.headers )
      debug( 'configure:response:body', body )

      self._replayNonce = response.headers['replay-nonce']
      self.directory = body

      callback.call( self, error, self.directory )

    })

  },

  /**
   * Fetch a new replay-nonce from the ACME server
   * @internal to replenish the nonce, if empty
   * @param  {Function} callback
   */
  getNonce: function( callback ) {

    var self = this

    this._request.head( this.options.directoryPath, function( error, response, body ) {
      if( error ) return callback.call( self, error );
      if( response.statusCode !== 200 ) {
        error = Client.getResponseError( error, response, body )
      }
      self._replayNonce = response.headers['replay-nonce']
      callback.call( self, error, self._replayNonce )
    })

  },

  /**
   * Generate a JWS signed payload body
   * @internal used for request bodies
   * @param  {Object} header
   * @param  {Object} payload
   * @param  {Array} [protectedFields]
   * @return {Object}
   */
  getJWSPayload: function( header, payload, protectedFields ) {

    var jsonProtectedHeader = JSON.stringify( header )
    var jsonPayload = JSON.stringify( payload )
    var publicHeader = Object.assign( {}, header )

    protectedFields = protectedFields || [ 'nonce' ]
    protectedFields.forEach( function( key ) {
      publicHeader[ key ] = void 0
      delete publicHeader[ key ]
    })

    var signatureInput = base64Url.encode( jsonProtectedHeader ) + '.' +
      base64Url.encode( jsonPayload )

    var signature = JSONWebAlgorithms.sign( 'RS256',
      new Buffer( signatureInput ),
      new Buffer( this.options.privateKey )
    )

    // var compactSerialization = base64Url.encode( jsonProtectedHeader ) + '.' +
    //   base64Url.encode( jsonPayload ) + '.' +
    //   base64Url.encode( signature )

    return {
      payload: base64Url.encode( jsonPayload ),
      protected: base64Url.encode( jsonProtectedHeader ),
      header: publicHeader,
      signature: base64Url.encode( signature ),
    }

  },

  /**
   * Register a new account for a given contact
   * @param  {Array}    contact
   * @param  {Function} callback
   */
  register: function( contact, callback ) {

    var self = this

    if( !this.isConfigured ) {
      return this.configure( function( error ) {
        if( error ) return void callback.call( self, error )
        self.register( contact, callback )
      })
    }

    if( !this.hasCapability( ACME.NEW_REGISTRATION ) ) {
      return void callback.call( this, new Error( 'New registrations not supported' ) )
    }

    if( !this._replayNonce ) {
      return this.getNonce( function( error ) {
        if( error ) return void callback.call( self, error )
        this.register( contact, callback )
      })
    }

    var header = {
      alg: 'RS256',
      jwk: JSONWebKey.fromPEM( this.options.publicKey ),
      nonce: this._replayNonce,
      typ: 'JWS',
    }

    // TODO: new ACME.Registration(...)
    var payload = {
      resource: ACME.NEW_REGISTRATION,
      contact: contact,
    }

    var body = this.getJWSPayload( header, payload )

    debug( 'register:payload', JSON.stringify( body ) )

    // Clear the replay-nonce
    this._replayNonce = null

    this._request.post( '/acme/new-reg', {
      body: body,
    }, function( error, response, body ) {

      debug( 'register:url', response.request.uri )

      if( error ) {
        debug( 'register:error', error.message )
        return callback.call( self, error, body )
      }

      if( response.statusCode <= 200 || response.statusCode >= 300 ) {
        error = Client.getResponseError( error, response, body )
      }

      debug( 'register:response:headers', response.headers )
      debug( 'register:response:body', body )

      self._replayNonce = response.headers[ 'replay-nonce' ]

      // TODO: Fetch location (?)
      var location = response.headers[ 'location' ]

      callback.call( self, error, location )

    })

  },

}

// Exports
module.exports = Client
