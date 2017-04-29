const chunkRegexp = /THREE\.ShaderChunk\[\s?\"(\w)*\s?\"\s?\]\,?/
const startChunkToken = /THREE\.ShaderChunk\[\s?\"/
const endChunkToken = /\s?\"\s?\]\,?/

const replaceThreeChunks =
module.exports.replaceThreeChunks = ( s ) => {
  if( !chunkRegexp.test( s ) ) {
    return s
  }
  const result = chunkRegexp.exec( s )
  const chunk = result[ 0 ]
  const shaderName = chunk.replace( startChunkToken, "" ).replace( endChunkToken, "" )

  const newContent = THREE.ShaderChunk[ shaderName ] ? THREE.ShaderChunk[ shaderName ] : ""
  if( newContent == "" ) {
    console.error( "UhOh", shaderName )
  }
  s = s.replace( result[ 0 ], newContent )

  return replaceThreeChunks( s )
}

const includeRegexp = /\#include\s?\<(\w)*\>\s?/
const startIncludeToken = /\#include\s?\</
const endIncludeToken = /\>\s?/

const replaceIncludes =
module.exports.replaceIncludes = ( s ) => {
  if( !includeRegexp.test( s ) ) {
    return s
  }
  const result = includeRegexp.exec( s )
  const chunk = result[ 0 ]
  const shaderName = chunk.replace( startIncludeToken, "" ).replace( endIncludeToken, "" )

  const newContent = THREE.ShaderChunk[ shaderName ] ? THREE.ShaderChunk[ shaderName ] : ""
  if( newContent == "" ) {
    console.error( "UhOh", shaderName )
  }
  s = s.replace( result[ 0 ], newContent + "\n" )

  return replaceIncludes( s )
}
