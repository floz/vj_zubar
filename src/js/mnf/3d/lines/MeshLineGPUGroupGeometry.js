class MeshLineGPUGroupGeometry extends THREE.BufferGeometry{

	constructor( linesCount, lineDivision,textureWidth,textureHeight, offsetID=0 ) {

		super()

		const l = linesCount * lineDivision

		const side 					= new Float32Array(l*2)
		const ids 					= new Float32Array(l*4)
		const prevIDs 			= new Float32Array(l*4)
		const nextIDs 			= new Float32Array(l*4)
		const uvs 					= new Float32Array(l*4)
		const index 				= new Uint16Array(l*6)

		let w, j, j2, j4;
		for(let i = 0; i < linesCount; i++){
			for( let n = 0; n < lineDivision; n++ ) {
				j = i * lineDivision + n
				j2 = j*2
				j4 = j*4

				side[j2] 	=  1
				side[j2+1] = -1

				uvs[j4] = uvs[j4+2] = (j%lineDivision) / ( lineDivision - 1 )
				uvs[j4+1] = 0
				uvs[j4+3] = 1

				ids[j4] = ids[j4+2] = (j%textureWidth)/textureWidth
				ids[j4+1] = ids[j4+3] = Math.floor(j/textureWidth)/textureHeight
				w = (n==0?j:j-1)
				prevIDs[j4] = prevIDs[j4+2] = (w%textureWidth)/textureWidth
				prevIDs[j4+1] = prevIDs[j4+3] = Math.floor(w/textureWidth)/textureHeight

				w = n==(lineDivision-1)?j:(j+1)
				nextIDs[j4] = nextIDs[j4+2] = (w%textureWidth)/textureWidth
				nextIDs[j4+1] = nextIDs[j4+3] = Math.floor(w/textureWidth)/textureHeight
			}
		}

		let n, k
		for(let i = 0; i < linesCount; i++){
			for( let j = 0; j < lineDivision - 1; j++ ) {
				n = j * 2 + i * (lineDivision) * 2
				k = j * 6 + i * (lineDivision) * 6
				index[k] 	 = n
				index[k+1] = index[k+4] = n + 1
				index[k+2] = index[k+3] = n + 2
				index[k+5] = n + 3
			}
		}

		this.addAttribute( 'ID', new THREE.BufferAttribute( ids, 2 ) )
		this.addAttribute( 'prevID', new THREE.BufferAttribute( prevIDs, 2 ) )
		this.addAttribute( 'nextID', new THREE.BufferAttribute( nextIDs, 2 ) )
		this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) )
		this.addAttribute( 'side', new THREE.BufferAttribute( side, 1 ) )

		this.setIndex( new THREE.BufferAttribute( index, 1 ) )
	}
}

module.exports = MeshLineGPUGroupGeometry
