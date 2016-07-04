var ACME = require( '..' )
var assert = require( 'assert' )

var ACME_API_BASE_URL = 'https://api.example.com'

suite( 'ACME.Client', function() {

  var scope = null

  suiteSetup( 'nock', function() {
    scope = require( 'nock' )( ACME_API_BASE_URL, {
      allowUnmocked: true,
    })
  })

  test( 'throws an error if baseUrl is not a string', function() {
    assert.throws( function() { new ACME.Client({ baseUrl: 42 }) })
    assert.throws( function() { new ACME.Client({ baseUrl: {} }) })
  })

})
