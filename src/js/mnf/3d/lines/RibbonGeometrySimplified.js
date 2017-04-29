// Use it as MeshLineGeometry
// The difference is that it has an orientation
// Vertex shader => mnf/3d/lines/shaders/Ribbon.vs
class RibbonGeometrySimplified extends THREE.BufferGeometry{

	constructor( pos ) {
		super()

		const l  = pos.length / 3;
		const l6 = l*6;

		const position 		  = new Float32Array(l6)

		const side 					= new Float32Array(l*2)
		const uvs 					= new Float32Array(l*4)
		const index 				= new Uint16Array(l6)

    this.feedArrays( pos, position )

		for( let j = 0; j < l; j++ ) {
			side[j*2] 	=  1
			side[j*2+1] = -1

			uvs[j*4] = uvs[j*4+2] = j / ( l )
			uvs[j*4+1] = 0
			uvs[j*4+3] = 1
		}
    side[ 0 ] = side[ 1 ] = 0

		let n, k
		for( let j = 0; j < l - 1; j++ ) {
			n = j * 2
			k = j * 6

			index[k] 	 = n
			index[k+1] = index[k+4] = n + 1
			index[k+2] = index[k+3] = n + 2
			index[k+5] = n + 3
		}

		this.addAttribute( 'position', new THREE.BufferAttribute( position, 3 ) )
		this.addAttribute( 'side', new THREE.BufferAttribute( side, 1 ) )
		this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) )
		this.setIndex( new THREE.BufferAttribute( index, 1 ) )
	}

	updatePositions( pos ){
		const position 	  = this.attributes.position.array

    this.feedArrays( pos, position )

		this.attributes.position.needsUpdate = true

		this.computeVertexNormals()
		this.computeBoundingBox()
	}

  feedArrays( pos, position ) {
    const l6 = pos.length * 2
		const l6m6 = l6 - 6

    let j2 = 0
    for( let j = 0; j < pos.length; j += 3 ) {
      j2 = j * 2
			position[j2]   =	position[j2+3] = pos[ j ]
			position[j2+1] =	position[j2+4] = pos[ j+1 ]
			position[j2+2] =	position[j2+5] = pos[ j+2 ]
		}

    position[0]   =	position[0+3] = pos[ 3 ]
    position[0+1] =	position[0+4] = pos[ 4 ]
    position[0+2] =	position[0+5] = pos[ 5 ]
  }

}

module.exports = RibbonGeometrySimplified

module.exports.fromTo = (p1,p2,pointCount=2)=>{
	const positions = new Float32Array( pointCount * 3 )

	let percent1, percent

	for(let i = 0; i < pointCount; i++){
		percent = i/(pointCount-1)
		percent1 = 1 - percent
		positions[i*3]   = p1.x*percent1 + p2.x*percent
		positions[i*3+1] = p1.y*percent1 + p2.y*percent
		positions[i*3+2] = p1.z*percent1 + p2.z*percent
	}
	return positions
}

module.exports.fromAngles = (angleStart,angleEnd,radius=5,pointCount=32)=>{
	const positions = new Float32Array( (pointCount)*3 )
	let step = (angleEnd-angleStart)/(pointCount-1)
	let k = 0
	for(let a = angleStart; a < angleEnd+step; a+=step){
		positions[k]   = Math.cos(a)*radius
		positions[k+1] = Math.sin(a)*radius
		positions[k+2] = 0
		k+=3
	}
	return positions;
}

module.exports.fromLength = (division)=>{
	const positions = new Float32Array( division*3 )
	return new RibbonGeometrySimplified(positions)
}
