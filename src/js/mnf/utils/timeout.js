// bigup kewah

const uDate = require( "mnf/utils/date" )

module.exports = function( fn, delay ) {
  const start = uDate.now()

  function lp() {
    if( uDate.now() - start >= delay ) {
      fn.call()
    } else {
      data.id = requestAnimationFrame( lp )
    }
  }

  const data = {}
  data.id = requestAnimationFrame( lp )

  return data
}

module.exports.clear = function( data ) {
  if( data ) {
    cancelAnimationFrame( data.id )
  }
}
