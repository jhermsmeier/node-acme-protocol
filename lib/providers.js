var freeze = require( './freeze' )

/**
 * ACME Provider
 * @class
 * @param {Object} options
 */
function Provider( options ) {

  if( !(this instanceof Provider) )
    return new Provider( options )

  /** @type {String} baseUrl [description] */
  this.baseUrl = 'acme.example.com'
  /** @type {String} directoryPath [description] */
  this.directoryPath = 'directory'
  /** @type {Object<String,Array<Number>>} supportedKeys [description] */
  this.supportedKeys = {
    rsa: [ 1024, 2048, 4096, 8192 ],
    ec: [ 354 ],
  }

  // Inherit passed options
  Object.assign( this, options )

  // Make provider immutable
  freeze( this )

}

/**
 * LetsEncrypt
 * @type {Provider}
 */
Provider.LetsEncrypt = new Provider({
  baseUrl: 'https://acme-v01.api.letsencrypt.org',
  supportedKeys: {
    rsa: [ 2048 ],
  },
})

/**
 * LetsEncrypt Staging
 * @type {Provider}
 */
Provider.LetsEncryptStaging = new Provider({
  baseUrl: 'https://acme-staging.api.letsencrypt.org',
  supportedKeys: {
    rsa: [ 2048 ],
    ec: [ 354 ], // ???
  },
})

// Exports
module.exports = Provider
