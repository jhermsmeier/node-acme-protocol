var ACME = module.exports

// Resource types
// @see https://ietf-wg-acme.github.io/acme/#rfc.section.5.1
ACME.NEW_REGISTRATION = 'new-reg'
ACME.NEW_AUTHORIZATION = 'new-authz'
ACME.NEW_APPLICATION = 'new-app'
ACME.NEW_CERTIFICATE = 'new-cert'
// ACME.RECOVER_REGISTRATION = 'recover-reg' // Deprecated?
ACME.REVOKE_CERTIFICATE = 'revoke-cert'
ACME.REGISTRATION = 'reg'
ACME.AUTHORIZATION = 'authz'
ACME.CHALLENGE = 'challenge'
ACME.CERTIFICATE = 'cert'

/**
 * Error codes
 * @type {Object}
 * @see https://github.com/ietf-wg-acme/acme/blob/master/draft-ietf-acme-acme.md#errors
 */
ACME.ERROR = {
  BAD_CSR: 'The CSR is unacceptable (e.g., due to a short key)',
  BAD_NONCE: 'The client sent an unacceptable anti-replay nonce',
  CONNECTION: 'The server could not connect to validation target',
  DNSSEC: 'DNSSEC validation failed',
  CAA: 'CAA records forbid the CA from issuing',
  MALFORMED: 'The request message was malformed',
  SERVER_INTERNAL: 'The server experienced an internal error',
  TLS: 'The server received a TLS error during validation',
  UNAUTHORIZED: 'The client lacks sufficient authorization',
  UNKNOWN_HOST: 'The server could not resolve a domain name',
  RATE_LIMITED: 'The request exceeds a rate limit',
  INVALID_CONTACT: 'The contact URI for a registration was invalid',
  REJECTED_IDENTIFIER: 'The server will not issue for the identifier',
  UNSUPPORTED_IDENTIFIER: 'Identifier is not supported, but may be in future',
}

ACME.Client = require( './client' )
