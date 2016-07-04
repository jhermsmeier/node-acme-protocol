var ACME = require( '..' )
var assert = require( 'assert' )
var nock = require( 'nock' )

var ACME_API_BASE_URL = 'https://api.example.com'

suite( 'ACME', function() {

  var client = new ACME.Client({
    baseUrl: ACME_API_BASE_URL,
  })

  test( 'throws an error if baseUrl is not a string', function() {
    assert.throws( function() { new ACME.Client({ baseUrl: 42 }) })
    assert.throws( function() { new ACME.Client({ baseUrl: {} }) })
  })

  test( '#getDirectory()', function( next ) {

    var payload = {
      'new-authz': ACME_API_BASE_URL + '/acme/new-authz',
      'new-cert': ACME_API_BASE_URL + '/acme/new-cert',
      'new-reg': ACME_API_BASE_URL + '/acme/new-reg',
      'revoke-cert': ACME_API_BASE_URL + '/acme/revoke-cert'
    }

    nock( ACME_API_BASE_URL )
      .get( '/directory' )
      .reply( 200, payload )

    client.getDirectory( function( error, data ) {
      assert.ifError( error )
      assert.ok( data )
      assert.deepStrictEqual( payload, data )
      next()
    })

  })

})
