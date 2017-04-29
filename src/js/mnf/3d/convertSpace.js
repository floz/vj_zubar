const stage3d = require('mnf/core/stage3d')
const stage = require('mnf/core/stage')

module.exports.worldToScreen = (position)=> {
	let vector = position.clone()
	vector.project( stage3d.camera )

	let hw = stage3d.renderer.domElement.width * .5
	let hh = stage3d.renderer.domElement.height * .5
	vector.x = ( vector.x * hw ) + hw;
	vector.y = - ( vector.y * hh ) + hh;
	vector.z = 0
	vector.multiplyScalar( 1/stage.pixelRatio )
	return vector
}


module.exports.screenToWorld = ( x, y, z=0 )=> {
	let vector = new THREE.Vector3(
		x / stage.width * 2 - 1,
		1 - y / stage.height * 2,
		0.5
	)

	vector.unproject( stage3d.camera )
	vector.sub( stage3d.camera.position ).normalize()

	let distance = ( z - stage3d.camera.position.z) / vector.z
	vector.multiplyScalar( distance )
	vector.add( stage3d.camera.position )
	vector.multiplyScalar( 1/stage.pixelRatio )
	return vector
}
