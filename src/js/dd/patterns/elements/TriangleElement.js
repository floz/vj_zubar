const replaceIncludes = require( "mnf/utils/shaders" ).replaceIncludes

const prefixVS  = "precision highp float;\n"

const vs = prefixVS + replaceIncludes( require( "./shaders/ShapeElement.vs" ) )
const vsDepth = replaceIncludes( require( "./shaders/ShapeElementDepth.vs" ) )
const fs = replaceIncludes( require( "./shaders/ShapeElement.fs" ) )

const config = require( "dd/core/config" )
const geometries = require( "dd/core/geometries" )
const colors = require( "dd/core/colors" )
const textures = require( "dd/core/textures" )
const ElementMaterial = require( "./ElementMaterial" )
const BaseElement = require( "./BaseElement" )

class TriangleElement extends BaseElement {

  constructor() {
    const mat = new ElementMaterial( {
      color: colors.get(),
      vertexShader: vs,
      vertexShaderDepth: vsDepth,
      fragmentShader: fs,
      transparent: true,
      uniforms: {
        tShape: { type: "t", value: textures.triangle }
      }
    } )

    super( geometries.plane, mat )

    this.castShadow = true
    this.customDepthMaterial = mat.depthMaterial
  }

  init( x, y, z, w, h, c ) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
    this.h = h

    this.position.x = x
    this.position.y = y
    this.position.z = z * config.zStep
    this.scale.set( w, h, .1 )
  }

  clean() {
    super.clean()

    if( !this.pool ) {
      this.pool = require( "./elementsPools" )
    }
    this.pool.triangle.release( this )
  }

}

module.exports = TriangleElement
