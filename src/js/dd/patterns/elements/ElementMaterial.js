const replaceIncludes = require( "mnf/utils/shaders" ).replaceIncludes

const prefixVS  = "precision highp float;\n"

const vs = prefixVS + replaceIncludes( require( "./shaders/BasicElement.vs" ) )
const vsDepth = replaceIncludes( require( "./shaders/BasicElementDepth.vs" ) )
const fs = replaceIncludes( require( "./shaders/BasicElement.fs" ) )

const stage3d = require( "mnf/core/stage3d" )

class ElementMaterial extends THREE.ShaderMaterial {

  constructor( { color = new Color( 0xff00ff ), vertexShader = vs, vertexShaderDepth = vsDepth, fragmentShader = fs, uniforms = {}, transparent = true } = {} ) {
    uniforms.color = { type: "c", value: color }
    uniforms.bgColor = { type: "c", value: stage3d.scene.fog.color }
    uniforms.opacity = { type: "f", value: 1 }

    super( {
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: transparent
    } )
    this.transparent = transparent
    this.clipping = true

    this.type = "ElementMaterial"

    this.depthMaterial = new THREE.ShaderMaterial( {
      vertexShader: vertexShaderDepth,
      fragmentShader: "#define DEPTH_PACKING 0\n"+replaceIncludes( THREE.ShaderLib.depth.fragmentShader ),
      uniforms: THREE.UniformsUtils.clone( uniforms )
    } )
  }

}

module.exports = ElementMaterial
