const vs = require( "./shaders/Floor.vs" )
const fs = require( "./shaders/Floor.fs" )

class FloorMat extends THREE.RawShaderMaterial {

  constructor( { color = new Color( 0xff00ff ), vertexShader = vs, fragmentShader = fs, uniforms = {}, transparent = false } = {} ) {
    uniforms.color = { type: "c", value: color }

    super( {
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: transparent
    } )

    this.type = "FloorMat"
  }

}

module.exports = FloorMat
