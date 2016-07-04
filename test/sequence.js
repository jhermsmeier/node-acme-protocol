var ACME = require( '..' )
var assert = require( 'assert' )
var URL = require( 'url' )

var ACME_API_BASE_URL = 'https://api.example.com'

suite( 'ACME Cert Sequence', function() {

  // The following table illustrates a typical sequence of
  // requests required to establish a new account with the server,
  // prove control of an identifier, issue a certificate,
  // and fetch an updated certificate some time after issuance.
  // The “->” is a mnemonic for a Location header pointing to a created resource.
  //
  // | Action             | Request        | Response     |
  // |--------------------|----------------|--------------|
  // | Register           | POST new-reg   | 201 -> reg   |
  // | Request challenges | POST new-authz | 201 -> authz |
  // | Answer challenges  | POST challenge | 200          |
  // | Poll for status    | GET authz      | 200          |
  // | Request issuance   | POST new-cert  | 201 -> cert  |
  // | Check for new cert | GET cert       | 200          |

  var client = null
  var keyPair = null
  var scope = null

  suiteSetup( 'nock', function() {
    scope = require( 'nock' )( ACME_API_BASE_URL, {
      allowUnmocked: true,
    })
  })

  suiteSetup( 'generate keypair', function( done ) {
    require( './util/keypair' ).create( function( error, keys ) {
      keyPair = keys
      done( error )
    })
  })

  suiteSetup( 'create client', function() {
    client = new ACME.Client({
      baseUrl: ACME_API_BASE_URL,
      privateKey: keyPair.private,
      publicKey: keyPair.public,
    })
  })

  test( 'directory', function( done ) {

    var payload = {
      'new-authz': URL.resolve( ACME_API_BASE_URL, '/acme/new-authz' ),
      'new-cert': URL.resolve( ACME_API_BASE_URL, '/acme/new-cert' ),
      'new-reg': URL.resolve( ACME_API_BASE_URL, '/acme/new-reg' ),
      'revoke-cert': URL.resolve( ACME_API_BASE_URL, '/acme/revoke-cert' ),
      'meta': {
        'terms-of-service': URL.resolve( ACME_API_BASE_URL, '/acme/terms' ),
        'website': URL.resolve( ACME_API_BASE_URL, '/' ),
        'caa-identities': [ URL.parse( ACME_API_BASE_URL ).hostname ],
      },
    }

    scope.get( '/directory' )
      .reply( 200, payload )

    client.configure( function( error, directory ) {
      assert.ifError( error )
      assert.ok( directory )
      assert.deepStrictEqual( payload, directory )
      done()
    })

  })

  test.skip( 'register', function( done ) {

    var payload = null // = reg
    var expectedPostData = null
    var contact = [
      'mailto:cert-admin@example.com',
      'tel:+12025551212'
    ]

    scope.post( '/acme/new-reg', expectedPostData )
      .reply( 201, payload )

    client.register( contact, function( error, account ) {
      done( error )
    })

  })

  test.skip( 'request challenge', function( done ) {

    var payload = null
    var expectedPostData = null

    scope.post( '/acme/new-authz', expectedPostData )
      .reply( 201, payload )

    client.getChallenge( function( error, challenge ) {
      done( error )
    })

  })

  test.skip( 'answer challenge', function( done ) {

    var payload = null
    var expectedPostData = null

    scope.post( '/acme/challenge', expectedPostData )
      .reply( 201, payload )

    client.answerChallenge( function( error, result ) {
      done( error )
    })

  })

  test.skip( 'poll status', function( done ) {

    var payload = null

    scope.get( '/acme/authz' )
      .reply( 200, payload )

    client.getStatus( function( error, authorization ) {
      done( error )
    })

  })

  test.skip( 'request cert issuance', function( done ) {

    var payload = null
    var expectedPostData = null

    scope.post( '/acme/new-cert', expectedPostData )
      .reply( 201, payload )

    client.requestCert( function( error, cert ) {
      done( error )
    })

  })

  test.skip( 'check for new cert', function( done ) {

    var payload = null

    scope.get( '/acme/cert' )
      .reply( 200, payload )

    client.getStatus( function( error, cert ) {
      done( error )
    })

  })

})
