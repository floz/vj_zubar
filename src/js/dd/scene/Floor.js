const geometries = require( "dd/core/geometries" )

class Floor extends THREE.Mesh {

  constructor() {
    const phongMaterial = new THREE.MeshPhongMaterial( { color: 0xaaaaaa, shininess: 0, specular: 0x050505, shading: THREE.SmoothShading } )
    super( geometries.plane, phongMaterial )

    this.scale.set( 10000, 10000, 1 )
    this.receiveShadow = true
  }

}

module.exports = Floor
