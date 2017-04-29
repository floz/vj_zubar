const textures = {
  triangle: new THREE.TextureLoader().load( "./textures/triangle.png" ),
  circle: new THREE.TextureLoader().load( "./textures/circle.png" ),
  noise: new THREE.TextureLoader().load( "./textures/noise.jpg" ),
}

textures.noise.wrapS = THREE.RepeatWrapping
textures.noise.wrapT = THREE.RepeatWrapping

module.exports = textures
