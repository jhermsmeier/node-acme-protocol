var ACME = require( '..' )
var fs = require( 'fs' )
var util = require( 'util' )

function inspect( value ) {
  return util.inspect( value, inspect.options )
}

inspect.options = {
  depth: null,
  colors: true,
}

// Obtain a keypair somehow;
// Read it from the file system, or generate it, etc.
var publicKey = fs.readFileSync( __dirname + '/../test/keys/public.pem', 'utf8' )
var privateKey = fs.readFileSync( __dirname + '/../test/keys/private.pem', 'utf8' )

// Create a new ACME client for LetsEncrypt staging (testing)
var client = new ACME.Client({
  baseUrl: 'https://acme-staging.api.letsencrypt.org',
  privateKey: privateKey,
  publicKey: publicKey,
})

// Your contact
var contact = [ 'mailto:cert-admin@example.com' ]

// Register an account for your contact & key,
// or fetch the existing account for the given key
function registration( contact, callback ) {
  client.register( contact, function( error, registration ) {

    // NOTE: You should handle the error properly,
    // this is just for brevity of the example
    if( error && registration ) {
      // We've already registered with this key,
      // and since we didn't store our registration on disk,
      // update it, to effectively fetch it again
      return client.getRegistration( callback )
    }

    return callback( error, registration )

  })
}

registration( contact, function( error, registration ) {

  if( error )
    throw error

  console.log( 'registration', inspect( registration ) )

  var auth = {
    resource: ACME.NEW_AUTHORIZATION,
    identifier: {
      type: 'dns',
      value: 'localhost',
    }
  }

  client.newAuthorization( auth, function( error, auth ) {
    console.log( 'authorization', inspect( error, auth ) )
  })

})
