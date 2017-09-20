var ACME = require( '../' )
var URL = require( 'url' )
var base64Url = require( 'base64-url' )
var JSONWebAlgorithms = require( 'json-web-algorithms' )
var JSONWebKey = require( 'json-web-key' )
var request = require( 'request' )
var info = require( '../package.json' )
var inherit = require( 'bloodline' )
var Emitter = require( 'events' ).EventEmitter
var debug = require( 'autodebug' )
var HTTPLink = require( 'http-link-header' )

/**
 * ACME Protocol Client
 * @constructor
 * @param {Object} options
 * @return {Client}
 */
function Client( options ) {

  if( !(this instanceof Client) )
    return new Client( options )

  options = Object.assign( {}, Client.defaults, options )

  if( !options.baseUrl || typeof options.baseUrl !== 'string' )
    throw new TypeError( 'baseUrl must be a string' )

  Emitter.call( this, options )

  this.baseUrl = options.baseUrl

  /** @type {Object} ACME Directory */
  this.directory = null
  this.directoryUrl = options.directoryPath || null

  // URL to the registration resource,
  // if an account has already been registered
  this.registrationUrl = null
  this.registration = null

  this.publicKeyPEM = options.publicKey
  this.privateKeyPEM = options.privateKey
  this.publicKey = JSONWebKey.fromPEM( options.publicKey )
  this.privateKey = JSONWebKey.fromPEM( options.privateKey )

  this._nonces = []

  this._clientRequest = request.defaults({
    gzip: true,
    json: true,
    forever: true,
    baseUrl: options.baseUrl,
    headers: {
      'Accept': [ 'application/json', 'application/jose+json', 'application/problem+json' ],
      'Content-Type': 'application/jose+json',
      'User-Agent': options.userAgent,
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
  userAgent: require( './user-agent' ),
}

/**
 * Build a detailed error from a problem response
 * @param  {Error} error
 * @param  {Object} response
 * @param  {Object} body
 * @return {Error}
 */
Client.getResponseError = function( error, response, body ) {

  error = error || new Error( response.statusMessage )
  error.detail = body

  if( response.headers['content-type'] === 'application/problem+json' ) {
    var errorType = body.type.replace( 'urn:acme:error:', '' ).toUpperCase()
    error.code = errorType
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

  // Clear the replay nonce, once accessed
  get _replayNonce() {
    return this._nonces.shift()
  },

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

  _request: function( options, callback ) {

    var self = this

    debug( 'http:request', options )

    return this._clientRequest( options, function( error, response, body ) {

      if( response ) {
        debug( 'http:request:headers', response.request.headers )
        debug( 'http:response:status', response.statusCode )
        debug( 'http:response:headers', response.headers )
        debug( 'http:response:body', body )
      }

      if( error ) {
        debug( 'http:error', error.message )
        return callback.call( self, error, body )
      }

      if( response.statusCode < 200 || response.statusCode >= 300 ) {
        error = Client.getResponseError( error, response, body )
        debug( 'http:error', error.message )
      }

      if( response.headers[ 'replay-nonce' ] ) {
        self._nonces.push( response.headers[ 'replay-nonce' ] )
      }

      if( response.headers[ 'link' ] ) {
        response.link = HTTPLink.parse( response.headers[ 'link' ] )
        debug( 'http:response:link', response.link )
      }

      callback.call( self, error, response, body )

    })

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
    var path = this.directoryUrl = ( argv.pop() || this.directoryUrl )

    debug( 'configure %s', path )

    this._request({ url: path }, function( error, response, body ) {
      self.directory = body
      callback.call( self, error, self.directory )
    })

  },

  /**
   * Fetch a new replay-nonce from the ACME server,
   * utlizing a HEAD request
   * @internal to replenish the nonce, if empty
   * @param  {Function} callback
   */
  getNonce: function( callback ) {

    var self = this

    debug( 'nonce:get' )

    this._request({
      method: 'HEAD',
      url: this.directoryUrl,
    }, function( error, response, body ) {
      callback.call( self, error )
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
  signPayload: function( payload, header, protectedFields ) {

    header = header || {
      alg: 'RS256',
      jwk: this.publicKey,
      nonce: this._replayNonce,
      typ: 'JWS',
    }

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
      new Buffer( this.privateKeyPEM )
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
    var retry = function retry( error ) {
      if( error ) return void callback.call( self, error )
      self.register( contact, callback )
    }

    debug( 'registration:new', contact )

    if( !this.isConfigured )
      return this.configure( retry )

    if( !this.hasCapability( ACME.RESOURCE.NEW_REGISTRATION ) )
      return void callback.call( this, new Error( 'New registrations not supported' ) )

    if( !self._nonces.length )
      return self.getNonce( retry )

    // TODO: new ACME.RESOURCE.Registration(...)
    var registration = {
      resource: ACME.RESOURCE.NEW_REGISTRATION,
      contact: contact,
    }

    this.registration = registration

    this._request({
      method: 'POST',
      url: '/acme/new-reg',
      body: this.signPayload( registration ),
    }, function( error, response, body ) {

      self.registrationUrl = ( response && response.headers[ 'location' ] ) ?
        URL.parse( response.headers[ 'location' ] ).pathname :
        null

      debug( 'registration:new %s', self.registrationUrl )

      if( self.registrationUrl ) {
        self.getRegistration( callback )
      } else {
        callback.call( self, error )
      }

    })

  },

  /**
   * Retrieve an existing registration
   * @param  {Function} callback
   */
  getRegistration: function( callback ) {
    debug( 'registration:get %s', this.registrationUrl )
    this.updateRegistration({ resource: ACME.RESOURCE.REGISTRATION }, callback )
  },

  /**
   * Update an existing registration, i.e. to agree to the TOS
   * @param  {Object}   registration
   * @param  {Function} callback
   */
  updateRegistration: function( registration, callback ) {

    var self = this
    var retry = function retry( error ) {
      if( error ) return void callback.call( self, error )
      self.updateRegistration( registration, callback )
    }

    debug( 'registration:update %s', this.registrationUrl )
    debug( 'registration:update', registration )

    if( !this.isConfigured )
      return this.configure( retry )

    if( !this.hasCapability( ACME.RESOURCE.NEW_REGISTRATION ) )
      return void callback.call( this, new Error( 'Registration resource not supported' ) )

    if( !self._nonces.length )
      return self.getNonce( retry )

    this._request({
      method: 'POST',
      url: this.registrationUrl,
      body: this.signPayload( registration ),
    }, function( error, response, body ) {

      if( !error ) {
        Object.assign( self.registration, body )
        self.registration.key = JSONWebKey.fromJSON( self.registration.key )
      }

      callback.call( self, error, self.registration )

    })

  },

  /**
   * Request a new authorization
   * @param  {Object}   authorization
   * @param  {Function} callback
   */
  newAuthorization: function( authorization, callback ) {

    var self = this
    var retry = function retry( error ) {
      if( error ) return void callback.call( self, error )
      self.newAuthorization( authorization, callback )
    }

    debug( 'authorization:new', authorization )

    if( !this.isConfigured )
      return this.configure( retry )

    if( !this.hasCapability( ACME.RESOURCE.NEW_AUTHORIZATION ) )
      return void callback.call( this, new Error( 'New authorization not supported' ) )

    if( !self._nonces.length )
      return self.getNonce( retry )

    this._request({
      method: 'POST',
      url: '/acme/new-authz',
      body: this.signPayload( authorization ),
    }, function( error, response, body ) {
      callback.call( self, error, body )
    })

  },

  newApplication: function( application, callback ) {

    var self = this
    var retry = function retry( error ) {
      if( error ) return void callback.call( self, error )
      self.newApplication( application, callback )
    }

    debug( 'application:new' )

    if( !this.isConfigured )
      return this.configure( retry )

    if( !this.hasCapability( ACME.RESOURCE.NEW_APPLICATION ) )
      return void callback.call( this, new Error( 'New applications not supported' ) )

    if( !self._nonces.length )
      return self.getNonce( retry )

    this._request({
      method: 'POST',
      url: '/acme/new-app',
      body: this.signPayload( application ),
    }, function( error, response, body ) {
      callback.call( self, error, body )
    })

  },

}

inherit( Client, Emitter )
// Exports
module.exports = Client
