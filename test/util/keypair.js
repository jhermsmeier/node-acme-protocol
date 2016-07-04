var forge = require( 'node-forge' )
var keypair = module.exports

keypair.create = function( callback ) {

  var keySize = 1024

  forge.pki.rsa.generateKeyPair( keySize, function( error, keyPair ) {
    if( error ) return callback( error );
    callback( null, {
      private: forge.pki.privateKeyToPem( keyPair.privateKey ),
      public: forge.pki.publicKeyToPem( keyPair.publicKey ),
    })
  })

}
