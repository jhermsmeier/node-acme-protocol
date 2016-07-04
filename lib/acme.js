var ACME = module.exports

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
ACME.E_BADCSR = 'The CSR is unacceptable (e.g., due to a short key)'
ACME.E_BADNONCE = 'The client sent an unacceptable anti-replay nonce'
ACME.E_CONNECTION = 'The server could not connect to the client for DV'
ACME.E_DNSSEC = 'The server could not validate a DNSSEC signed domain'
ACME.E_MALFORMED = 'The request message was malformed'
ACME.E_SERVERINTERNAL = 'The server experienced an internal error'
ACME.E_TLS = 'The server experienced a TLS error during DV'
ACME.E_UNAUTHORIZED = 'The client lacks sufficient authorization'
ACME.E_UNKNOWNHOST = 'The server could not resolve a domain name'
ACME.E_RATELIMITED = 'The request exceeds a rate limit'

ACME.generateNonce = function( n, callback ) {
  crypto.randomBytes( n, function( error, buffer ) {
    callback( error, buffer ? buffer.toString( 'hex' ) : null )
  })
}

ACME.Client = require( './client' )
