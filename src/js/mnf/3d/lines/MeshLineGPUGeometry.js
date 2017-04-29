class MeshLineGPUGeometry extends THREE.BufferGeometry{

	constructor( pos, offsetID, widthCallback = null ) {

		super()

		const l  = pos.length / 3;

		const side 					= new Float32Array(l*2)
		const ids 					= new Float32Array(l*2)
		const uvs 					= new Float32Array(l*4)
		const index 				= new Uint16Array(l*6)

		let w;
		for( let j = 0; j < l; j++ ) {
			ids[j*2] = j + offsetID
			ids[j*2+1] = j + offsetID
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

		this.addAttribute( 'id', new THREE.BufferAttribute( ids, 1 ) )
		this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) )
		this.addAttribute( 'side', new THREE.BufferAttribute( side, 1 ) )

		this.setIndex( new THREE.BufferAttribute( index, 1 ) )
	}

}

module.exports = MeshLineGPUGeometry
