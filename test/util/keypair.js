var fs = require( 'fs' )
var forge = require( 'node-forge' )
var keypair = module.exports

var DIR = __dirname + '/../keys'

keypair.create = function( callback ) {

  var keySize = 2048
  var keys = null

  try { fs.mkdirSync( DIR ) } catch( e ) {}

  try {
    keys = {
      public: fs.readFileSync( DIR + '/public.pem', 'utf8' ),
      private: fs.readFileSync( DIR + '/private.pem', 'utf8' ),
    }
  } catch( e ) {}

  if( keys ) return callback( null, keys )

  forge.pki.rsa.generateKeyPair( keySize, function( error, keyPair ) {

    if( error ) return callback( error );

    keys = {
      private: forge.pki.privateKeyToPem( keyPair.privateKey ),
      public: forge.pki.publicKeyToPem( keyPair.publicKey ),
    }

    try {
      fs.writeFileSync( DIR + '/public.pem', keys.public )
      fs.writeFileSync( DIR + '/private.pem', keys.private )
    } catch( e ) {}

    callback( null, keys )

  })

}
