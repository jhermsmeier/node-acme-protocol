var ACME = require( '..' )
var assert = require( 'assert' )
var nock = require( 'nock' )

suite( 'ACME', function() {
  
  var acme = new ACME({
    baseUrl: 'https://mock_encrypt.example.com',
  })

  test( 'throws an error if baseUrl is not a string', function() {
    assert.throws( function() {
      new ACME({ baseUrl: 42 })
    })


    assert.throws( function() {
      new ACME({ baseUrl: {} })
    })
  })
  
  test( '#getDirectory()', function( next ) {
    var payload = { 
      'new-authz': 'https://mock_encrypt.example.com/acme/new-authz',
      'new-cert': 'https://mock_encrypt.example.com/acme/new-cert',
      'new-reg': 'https://mock_encrypt.example.com/acme/new-reg',
      'revoke-cert': 'https://mock_encrypt.example.com/acme/revoke-cert' 
    }
    
    nock( 'https://mock_encrypt.example.com' )
      .get( '/directory' )
      .reply( 200, payload )

    acme.getDirectory( function( error, data ) {
      assert.ifError( error )
      assert.ok( data )
      assert.deepStrictEqual( payload, data )
      next()
    })
  })
  
})
