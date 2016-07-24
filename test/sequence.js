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
    var nock = require( 'nock' )
    scope = nock( ACME_API_BASE_URL, {
      allowUnmocked: true,
    })
  })

  suiteSetup( 'generate keypair', function( done ) {
    this.timeout( 60 * 1000 )
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

    var headers = {
      'replay-nonce': 'j9SDqC6KPjqyZ5RqCR8iMCBzYXbEXNFMFeWfQM_ayaY',
    }

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

    scope && scope.get( '/directory' )
      .reply( 200, payload, headers )

    client.configure( function( error, directory ) {
      assert.ifError( error )
      assert.ok( directory )
      assert.deepStrictEqual( payload, directory )
      done()
    })

  })

  test( 'register', function( done ) {

    var headers = {
      'replay-nonce': 'r84ft2QNfb9TVlNDdYXnkclV_yCcsq6UqYybehBziwM',
      'location': ACME_API_BASE_URL + '/acme/reg/246840',
    }

    var payload = {
      id: 246840,
      key: {
        kty: 'RSA',
        n: 'oL9U7lsMfBGZiFO_NmvTbPlPaMgMfg9iuxO2IkgKrJbKVtrGvfzNCOMIaO_wAx8AIf3-tegeaEWWV6FyO6haW1zPhKovVAYyXQKof8CKvueooTie46d0JAHirdAGWn2BWCQKQ-GlFqqMx2ou1BHv9MxfGKaT9CjT8cIROl1ptag3kdUH5ZsjhGmdg_TNXeu4wtiYVf0JG9nWfZncX4Dgv6IpSCoQiGf6FIE_q0jaUhpdBdQ6HEL_s6O3L45FFYvGfAuiciuKVZugR3hXCUJ26NmShMKfdu5qUKPQ02-IQAFGncnMNOVPeDhkLMMIaNerGCsjVz1l_TjXOSTW-h1paw',
        e: 'AQAB'
      },
      contact: [ 'mailto:cert-admin@example.com' ],
      initialIp: '217.246.162.70',
      createdAt: '2016-07-05T22:28:50.541576377Z'
    }

    var expectedPostData = '{"payload":"eyJyZXNvdXJjZSI6Im5ldy1yZWciLCJjb250YWN0IjpbIm1haWx0bzpjZXJ0LWFkbWluQGV4YW1wbGUuY29tIl19","protected":"eyJhbGciOiJSUzI1NiIsImp3ayI6eyJrdHkiOiJSU0EiLCJuIjoib0w5VTdsc01mQkdaaUZPX05tdlRiUGxQYU1nTWZnOWl1eE8ySWtnS3JKYktWdHJHdmZ6TkNPTUlhT193QXg4QUlmMy10ZWdlYUVXV1Y2RnlPNmhhVzF6UGhLb3ZWQVl5WFFLb2Y4Q0t2dWVvb1RpZTQ2ZDBKQUhpcmRBR1duMkJXQ1FLUS1HbEZxcU14Mm91MUJIdjlNeGZHS2FUOUNqVDhjSVJPbDFwdGFnM2tkVUg1WnNqaEdtZGdfVE5YZXU0d3RpWVZmMEpHOW5XZlpuY1g0RGd2NklwU0NvUWlHZjZGSUVfcTBqYVVocGRCZFE2SEVMX3M2TzNMNDVGRll2R2ZBdWljaXVLVlp1Z1IzaFhDVUoyNk5tU2hNS2ZkdTVxVUtQUTAyLUlRQUZHbmNuTU5PVlBlRGhrTE1NSWFOZXJHQ3NqVnoxbF9UalhPU1RXLWgxcGF3IiwiZSI6IkFRQUIifSwibm9uY2UiOiJqOVNEcUM2S1BqcXlaNVJxQ1I4aU1DQnpZWGJFWE5GTUZlV2ZRTV9heWFZIiwidHlwIjoiSldTIn0","header":{"alg":"RS256","jwk":{"kty":"RSA","n":"oL9U7lsMfBGZiFO_NmvTbPlPaMgMfg9iuxO2IkgKrJbKVtrGvfzNCOMIaO_wAx8AIf3-tegeaEWWV6FyO6haW1zPhKovVAYyXQKof8CKvueooTie46d0JAHirdAGWn2BWCQKQ-GlFqqMx2ou1BHv9MxfGKaT9CjT8cIROl1ptag3kdUH5ZsjhGmdg_TNXeu4wtiYVf0JG9nWfZncX4Dgv6IpSCoQiGf6FIE_q0jaUhpdBdQ6HEL_s6O3L45FFYvGfAuiciuKVZugR3hXCUJ26NmShMKfdu5qUKPQ02-IQAFGncnMNOVPeDhkLMMIaNerGCsjVz1l_TjXOSTW-h1paw","e":"AQAB"},"typ":"JWS"},"signature":"PilLEH8oeTIIMiQkdCnjA8ju5DbCJM4wtjnLF5yzV67uaWEaZgzMMm82uynQF4HbV1yOse6iz75ntJdjOH0xVsFEd-0UJup_byX_52UJ4ZOi_GUZFohbWiNLSv_IIrQqNEbuCMKWyWzarYPYy0mFA0zyjyLJU8_Ethcp_oKA_jHRJrW5HEYtJZ771rxbHQOyVSlcRWxi0GiexsvhP6Q8A9yMcxpO_FbOlI1Cz21yLO0ni7i5GrGbSL4ru9TsA2QOpflV6m3fDUeL_nRLK35H0cuPTJunvi8aFv3NHi3_9Vc7LEFHH9ZsxnJZygy6Wjc6ApPzZEZJ_DYiv7_zJX9Z5A"}'
    var contact = [
      'mailto:cert-admin@example.com'
    ]

    scope && scope.post( '/acme/new-reg', expectedPostData )
      .reply( 201, payload, headers )

    client.register( contact, function( error, registration ) {
      assert.strictEqual( registration, headers.location )
      done( error )
    })

  })

  test( 'register again with same key', function( done ) {

    var headers = {
      'content-type': 'application/problem+json',
      'replay-nonce': 'yJsGfcnLUMCTdsKGEv2D8jgTCH8RYYqIiJtSMdlu94Y',
      'location': ACME_API_BASE_URL + '/acme/reg/246840',
    }

    var payload = {
      type: 'urn:acme:error:malformed',
      detail: 'Registration key is already in use',
      status: 409
    }

    var expectedPostData = '{"payload":"eyJyZXNvdXJjZSI6Im5ldy1yZWciLCJjb250YWN0IjpbIm1haWx0bzpjZXJ0LWFkbWluQGV4YW1wbGUuY29tIl19","protected":"eyJhbGciOiJSUzI1NiIsImp3ayI6eyJrdHkiOiJSU0EiLCJuIjoib0w5VTdsc01mQkdaaUZPX05tdlRiUGxQYU1nTWZnOWl1eE8ySWtnS3JKYktWdHJHdmZ6TkNPTUlhT193QXg4QUlmMy10ZWdlYUVXV1Y2RnlPNmhhVzF6UGhLb3ZWQVl5WFFLb2Y4Q0t2dWVvb1RpZTQ2ZDBKQUhpcmRBR1duMkJXQ1FLUS1HbEZxcU14Mm91MUJIdjlNeGZHS2FUOUNqVDhjSVJPbDFwdGFnM2tkVUg1WnNqaEdtZGdfVE5YZXU0d3RpWVZmMEpHOW5XZlpuY1g0RGd2NklwU0NvUWlHZjZGSUVfcTBqYVVocGRCZFE2SEVMX3M2TzNMNDVGRll2R2ZBdWljaXVLVlp1Z1IzaFhDVUoyNk5tU2hNS2ZkdTVxVUtQUTAyLUlRQUZHbmNuTU5PVlBlRGhrTE1NSWFOZXJHQ3NqVnoxbF9UalhPU1RXLWgxcGF3IiwiZSI6IkFRQUIifSwibm9uY2UiOiJyODRmdDJRTmZiOVRWbE5EZFlYbmtjbFZfeUNjc3E2VXFZeWJlaEJ6aXdNIiwidHlwIjoiSldTIn0","header":{"alg":"RS256","jwk":{"kty":"RSA","n":"oL9U7lsMfBGZiFO_NmvTbPlPaMgMfg9iuxO2IkgKrJbKVtrGvfzNCOMIaO_wAx8AIf3-tegeaEWWV6FyO6haW1zPhKovVAYyXQKof8CKvueooTie46d0JAHirdAGWn2BWCQKQ-GlFqqMx2ou1BHv9MxfGKaT9CjT8cIROl1ptag3kdUH5ZsjhGmdg_TNXeu4wtiYVf0JG9nWfZncX4Dgv6IpSCoQiGf6FIE_q0jaUhpdBdQ6HEL_s6O3L45FFYvGfAuiciuKVZugR3hXCUJ26NmShMKfdu5qUKPQ02-IQAFGncnMNOVPeDhkLMMIaNerGCsjVz1l_TjXOSTW-h1paw","e":"AQAB"},"typ":"JWS"},"signature":"e0TAH4BUwMIHJEzluxFTgFi5wzcDppkhVRXkwZ06C42fhbCvnQh0mL5sOK2qWi887IBDg3D5c1WtV62Rr82y0f3hq1J06Th6HTF-soo-czta0GmxfbszL6BgVHqxhjr5aQPzRnHNYUTcsyetTuo4v3h95Rtq3DU1QQC91qx2e_vaLAzpoRUs_423RjVwV8XM3aBr567XuI0VOPS_eeWDFg0V0BCkCuIB2RvVe9ASNXd1IwK6Ozehmc114wZCJv-KpNO43Ni-BrgotlNDIuz8ffr5R9R8CaGWr3MDj8Up9XjZ5aHigqwjgwNZvauCKdkvyq-Cllh4VgnIjAcqdHzpyA"}'
    var contact = [
      'mailto:cert-admin@example.com'
    ]

    scope && scope.post( '/acme/new-reg', expectedPostData )
      .reply( 409, payload, headers )

    client.register( contact, function( error, registration ) {
      assert.ok( error instanceof Error )
      assert.strictEqual( error.status, payload.status )
      assert.strictEqual( error.type, payload.type )
      assert.strictEqual( error.detail, payload.detail )
      assert.strictEqual( registration, headers.location )
      done()
    })

  })

  test( 'update registration w/ agreement', function( done ) {

    var payload = {
      id: 246840,
      key: {
        kty: 'RSA',
        n: 'oL9U7lsMfBGZiFO_NmvTbPlPaMgMfg9iuxO2IkgKrJbKVtrGvfzNCOMIaO_wAx8AIf3-tegeaEWWV6FyO6haW1zPhKovVAYyXQKof8CKvueooTie46d0JAHirdAGWn2BWCQKQ-GlFqqMx2ou1BHv9MxfGKaT9CjT8cIROl1ptag3kdUH5ZsjhGmdg_TNXeu4wtiYVf0JG9nWfZncX4Dgv6IpSCoQiGf6FIE_q0jaUhpdBdQ6HEL_s6O3L45FFYvGfAuiciuKVZugR3hXCUJ26NmShMKfdu5qUKPQ02-IQAFGncnMNOVPeDhkLMMIaNerGCsjVz1l_TjXOSTW-h1paw',
        e: 'AQAB'
      },
      contact: [ 'mailto:cert-admin@example.com' ],
      agreement: 'https://letsencrypt.org/documents/LE-SA-v1.0.1-July-27-2015.pdf',
      initialIp: '217.246.162.70',
      createdAt: '2016-07-05T22:28:50Z'
    }

    var expectedPostData = {
      payload: 'eyJyZXNvdXJjZSI6InJlZyIsImNvbnRhY3QiOlsibWFpbHRvOmNlcnQtYWRtaW5AZXhhbXBsZS5jb20iXSwiYWdyZWVtZW50IjoiaHR0cHM6Ly9sZXRzZW5jcnlwdC5vcmcvZG9jdW1lbnRzL0xFLVNBLXYxLjAuMS1KdWx5LTI3LTIwMTUucGRmIiwia2V5Ijp7Imt0eSI6IlJTQSIsIm4iOiJvTDlVN2xzTWZCR1ppRk9fTm12VGJQbFBhTWdNZmc5aXV4TzJJa2dLckpiS1Z0ckd2ZnpOQ09NSWFPX3dBeDhBSWYzLXRlZ2VhRVdXVjZGeU82aGFXMXpQaEtvdlZBWXlYUUtvZjhDS3Z1ZW9vVGllNDZkMEpBSGlyZEFHV24yQldDUUtRLUdsRnFxTXgyb3UxQkh2OU14ZkdLYVQ5Q2pUOGNJUk9sMXB0YWcza2RVSDVac2poR21kZ19UTlhldTR3dGlZVmYwSkc5bldmWm5jWDREZ3Y2SXBTQ29RaUdmNkZJRV9xMGphVWhwZEJkUTZIRUxfczZPM0w0NUZGWXZHZkF1aWNpdUtWWnVnUjNoWENVSjI2Tm1TaE1LZmR1NXFVS1BRMDItSVFBRkduY25NTk9WUGVEaGtMTU1JYU5lckdDc2pWejFsX1RqWE9TVFctaDFwYXciLCJlIjoiQVFBQiJ9fQ',
      protected: 'eyJhbGciOiJSUzI1NiIsImp3ayI6eyJrdHkiOiJSU0EiLCJuIjoib0w5VTdsc01mQkdaaUZPX05tdlRiUGxQYU1nTWZnOWl1eE8ySWtnS3JKYktWdHJHdmZ6TkNPTUlhT193QXg4QUlmMy10ZWdlYUVXV1Y2RnlPNmhhVzF6UGhLb3ZWQVl5WFFLb2Y4Q0t2dWVvb1RpZTQ2ZDBKQUhpcmRBR1duMkJXQ1FLUS1HbEZxcU14Mm91MUJIdjlNeGZHS2FUOUNqVDhjSVJPbDFwdGFnM2tkVUg1WnNqaEdtZGdfVE5YZXU0d3RpWVZmMEpHOW5XZlpuY1g0RGd2NklwU0NvUWlHZjZGSUVfcTBqYVVocGRCZFE2SEVMX3M2TzNMNDVGRll2R2ZBdWljaXVLVlp1Z1IzaFhDVUoyNk5tU2hNS2ZkdTVxVUtQUTAyLUlRQUZHbmNuTU5PVlBlRGhrTE1NSWFOZXJHQ3NqVnoxbF9UalhPU1RXLWgxcGF3IiwiZSI6IkFRQUIifSwibm9uY2UiOiJ4b1VKVnpqSlRxNDd2dFhNNm9lOVV5N0E5Z2xsS2dfY3pIdDhpektCaVZNIiwidHlwIjoiSldTIn0',
      signature: 'UUsJr6lkGLOloyXELW4-NrjFpYa0186nXdBP6bnKAN06R9v-yU6OMWjIp-J-WSTsnwqBnzusUtXz4609lV4X3XklaYtdrZY-gwEmNu5mlzaKe_b3QlJ9o1BDw-2dSQ7WABFCkanMGkwlmPchXXt8IEUHamMxhS7AVIfb1KyAs3E0pneUzbFfGZja5nAVxk5d8at5IrAsQSD1x74RHsmc9Nijmr6GO4CzFOCEGQRjh_qlh-nzCYfgR57VurFIAl2PEAPQ7b2ZqyvzlWkdTpo2is93OnkI16Iu-_2ArLLFN6YZGFeD3u828aSMuCYWhnPrnsmlivKGqLzx4ZjjCDJ04A',
      header: {
        alg: 'RS256',
        jwk: {
            kty: 'RSA',
            n: 'oL9U7lsMfBGZiFO_NmvTbPlPaMgMfg9iuxO2IkgKrJbKVtrGvfzNCOMIaO_wAx8AIf3-tegeaEWWV6FyO6haW1zPhKovVAYyXQKof8CKvueooTie46d0JAHirdAGWn2BWCQKQ-GlFqqMx2ou1BHv9MxfGKaT9CjT8cIROl1ptag3kdUH5ZsjhGmdg_TNXeu4wtiYVf0JG9nWfZncX4Dgv6IpSCoQiGf6FIE_q0jaUhpdBdQ6HEL_s6O3L45FFYvGfAuiciuKVZugR3hXCUJ26NmShMKfdu5qUKPQ02-IQAFGncnMNOVPeDhkLMMIaNerGCsjVz1l_TjXOSTW-h1paw',
            e: 'AQAB'
          },
        typ: 'JWS'
      },
    }

    scope && scope.post( client.registrationUrl, expectedPostData )
      .reply( 202, payload )

    var registration = {
      resource: ACME.REGISTRATION,
      contact: client.registration.contact.slice(),
      agreement: 'https://letsencrypt.org/documents/LE-SA-v1.0.1-July-27-2015.pdf',
    }

    // TODO:
    // var responseHeaders = {
    //   link: '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.0.1-July-27-2015.pdf>;rel="terms-of-service"',
    // }

    client.updateRegistration( registration, function( error, data ) {
      done( error )
    })

  })

  test.skip( 'request challenge', function( done ) {

    var payload = null
    var expectedPostData = null

    scope && scope.post( '/acme/new-authz', expectedPostData )
      .reply( 201, payload )

    client.getChallenge( function( error, challenge ) {
      done( error )
    })

  })

  test.skip( 'answer challenge', function( done ) {

    var payload = null
    var expectedPostData = null

    scope && scope.post( '/acme/challenge', expectedPostData )
      .reply( 201, payload )

    client.answerChallenge( function( error, result ) {
      done( error )
    })

  })

  test.skip( 'poll status', function( done ) {

    var payload = null

    scope && scope.get( '/acme/authz' )
      .reply( 200, payload )

    client.getStatus( function( error, authorization ) {
      done( error )
    })

  })

  test.skip( 'request cert issuance', function( done ) {

    var payload = null
    var expectedPostData = null

    scope && scope.post( '/acme/new-cert', expectedPostData )
      .reply( 201, payload )

    client.requestCert( function( error, cert ) {
      done( error )
    })

  })

  test.skip( 'check for new cert', function( done ) {

    var payload = null

    scope && scope.get( '/acme/cert' )
      .reply( 200, payload )

    client.getStatus( function( error, cert ) {
      done( error )
    })

  })

})
