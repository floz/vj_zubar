// Use it as MeshLineGeometry
// The difference is that it has an orientation
// Vertex shader => mnf/3d/lines/shaders/Ribbon.vs
class RibbonGeometry extends THREE.BufferGeometry{

	constructor( pos ) {
		super()

		const l  = pos.length / 3;
		const l6 = l*6;

		const position 		  = new Float32Array(l6)

    // allow us to determine the binormal and so the orientation
		const prev 			    = new Float32Array(l6)
    const curr          = new Float32Array(l6)
		const next 					= new Float32Array(l6)

		const side 					= new Float32Array(l*2)
		const uvs 					= new Float32Array(l*4)
		const index 				= new Uint16Array(l6)

    this.feedArrays( pos, position, prev, curr, next )

		for( let j = 0; j < l; j++ ) {
			side[j*2] 	=  1
			side[j*2+1] = -1

			uvs[j*4] = uvs[j*4+2] = j / ( l - 1 )
			uvs[j*4+1] = 0
			uvs[j*4+3] = 1
		}

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
		this.addAttribute( 'prev', new THREE.BufferAttribute( prev, 3 ) )
		this.addAttribute( 'curr', new THREE.BufferAttribute( curr, 3 ) )
		this.addAttribute( 'next', new THREE.BufferAttribute( next, 3 ) )
		this.addAttribute( 'side', new THREE.BufferAttribute( side, 1 ) )
		this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) )
		this.setIndex( new THREE.BufferAttribute( index, 1 ) )
	}

	updatePositions( pos ){
		const position 	  = this.attributes.position.array
    const prev        = this.attributes.prev.array
		const curr 				= this.attributes.curr.array
    const next 				= this.attributes.next.array

    this.feedArrays( pos, position, prev, curr, next )

		this.attributes.position.needsUpdate = true
		this.attributes.prev.needsUpdate = true
		this.attributes.curr.needsUpdate = true
		this.attributes.next.needsUpdate = true
	}

  feedArrays( pos, position, prev, curr, next ) {
    const l6 = pos.length * 2
		const l6m6 = l6 - 6

    for( let j = 0; j < pos.length; j += 3 ) {
			position[j*2]   =	position[j*2+3] = pos[ j ]
			position[j*2+1] =	position[j*2+4] = pos[ j+1 ]
			position[j*2+2] =	position[j*2+5] = pos[ j+2 ]

      curr[j*2]   =	curr[j*2+3] = pos[ j ]
			curr[j*2+1] =	curr[j*2+4] = pos[ j+1 ]
			curr[j*2+2] =	curr[j*2+5] = pos[ j+2 ]
		}

    // we take the second point (we need 3 points non equals to calculate the binormal)
    curr[ 0 ] = curr[ 3 ] = pos[ 3 ]
    curr[ 1 ] = curr[ 4 ] = pos[ 4 ]
    curr[ 2 ] = curr[ 5 ] = pos[ 5 ]

    // we take the previous last point (we need 3 points non equals to calculate the binormal)
    curr[ l6m6 ]     = curr[ l6m6 + 3 ] = pos[ l6m6 ]
    curr[ l6m6 + 1 ] = curr[ l6m6 + 4 ] = pos[ l6m6 ]
    curr[ l6m6 + 2 ] = curr[ l6m6 + 5 ] = pos[ l6m6 ]

		for( let j = 0; j < l6m6; j++ ) {
			next[j] = position[(j+12)%l6] // +12 instead of +6 for the same reason as before - we cheat to avoid creating another point
		}
		let diff = ( position[0] == position[l6-3]
              && position[1] == position[l6-2]
              && position[2] == position[l6-1] ) ? 6 : l6 - 6
		for( let j = 0; j < 6 ; j++ ) {
			next[l6m6+j] = position[diff+j]
		}

		diff = ( position[0] == position[l6-3]
          && position[1] == position[l6-2]
          && position[2] == position[l6-1] ) ? l6 - 12 : 0;
		for( let j = 0; j < 6 ; j++ ) {
			prev[j] = position[j+diff]
		}
		for( let j = 6; j < l6; j++ ) {
			prev[j] = position[j-12] // -12 instead of -6 for the same reason as before - we cheat to avoid creating another point
		}
  }

}

module.exports = RibbonGeometry

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
	return new RibbonGeometry(positions)
}
