var ACME = require( '..' )
var assert = require( 'assert' )
var nock = require( 'nock' )

suite( 'ACME', function() {

  var client = new ACME({
    baseUrl: 'https://api.example.com',
  })

  test( 'throws an error if baseUrl is not a string', function() {
    assert.throws( function() { new ACME({ baseUrl: 42 }) })
    assert.throws( function() { new ACME({ baseUrl: {} }) })
  })

  test( '#getDirectory()', function( next ) {

    var payload = {
      'new-authz': 'https://api.example.com/acme/new-authz',
      'new-cert': 'https://api.example.com/acme/new-cert',
      'new-reg': 'https://api.example.com/acme/new-reg',
      'revoke-cert': 'https://api.example.com/acme/revoke-cert'
    }

    nock( 'https://api.example.com' )
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
