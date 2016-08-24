/**
 * Deep-freeze an object (make immutable)
 * @param  {Any} value
 * @return {Any} value
 */
function freeze( value ) {

  // Retrieve the property names defined on value
  var props = Object.getOwnPropertyNames( value )

  // Freeze properties before freezing self
  props.forEach( function( key ) {
    var prop = value[ name ]
    // Freeze prop if it is an object
    if( typeof prop == 'object' && prop !== null )
      freeze( prop )
  })

  // Freeze self (no-op if already frozen)
  return Object.freeze( value )

}

module.exports = freeze
