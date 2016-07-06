var ACME = module.exports

// Resource types
// @see https://ietf-wg-acme.github.io/acme/#rfc.section.5.1
ACME.NEW_REGISTRATION = 'new-reg'
ACME.NEW_AUTHORIZATION = 'new-authz'
ACME.NEW_CERTIFICATE = 'new-cert'
// ACME.RECOVER_REGISTRATION = 'recover-reg' // Deprecated?
ACME.REVOKE_CERTIFICATE = 'revoke-cert'
ACME.REGISTRATION = 'reg'
ACME.AUTHORIZATION = 'authz'
ACME.CHALLENGE = 'challenge'
ACME.CERTIFICATE = 'cert'

// Error codes
// @see https://ietf-wg-acme.github.io/acme/#rfc.section.5.4
// @see http://tools.ietf.org/html/draft-ietf-appsawg-http-problem-02
ACME.E_BAD_CSR = 'The CSR is unacceptable'
ACME.E_BAD_NONCE = 'The client sent an unacceptable anti-replay nonce'
ACME.E_CONNECTION = 'The server could not connect to validation target'
ACME.E_DNSSEC = 'DNSSEC validation failed'
ACME.E_CAA = 'CAA records forbid the CA from issuing'
ACME.E_MALFORMED = 'The request message was malformed'
ACME.E_SERVER_INTERNAL = 'The server experienced an internal error'
ACME.E_TLS = 'The server received a TLS error during validation'
ACME.E_UNAUTHORIZED = 'The client lacks sufficient authorization'
ACME.E_UNKNOWN_HOST = 'The server could not resolve a domain name'
ACME.E_RATE_LIMITED = 'The request exceeds a rate limit'
ACME.E_INVALID_CONTACT = 'The contact URI for a registration was invalid'
ACME.E_REJECTED_IDENTIFIER = 'The server will not issue for the identifier'

ACME.Client = require( './client' )
