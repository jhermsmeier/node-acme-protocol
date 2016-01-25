var ACME = require( '..' )
var assert = require( 'assert' )

suite( 'ACME', function() {
  
  var acme = new ACME({
    baseUrl: 'https://acme-staging.api.letsencrypt.org',
  })
  
  test( '#getDirectory()', function( next ) {
    acme.getDirectory( function( error, data ) {
      assert.ifError( error )
      assert.ok( data )
      console.log( data )
      next()
    })
  })
  
})
