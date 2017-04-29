const config = require( "dd/core/config" )
const geometries = require( "dd/core/geometries" )
const colors = require( "dd/core/colors" )
const ElementMaterial = require( "./ElementMaterial" )
const BaseElement = require( "./BaseElement" )

class SquareElement extends BaseElement {

  constructor() {
    const mat = new ElementMaterial( {
      color: colors.get()
    } )

    super( geometries.cube, mat )

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
    this.setZStep( z )
    this.scale.set( w, h, .5 )
  }

  show( zStop = 0 ) {
    super.show( zStop )

    if( Math.random() < ( this.z / 8 ) ) {
      const z = ( this.z - 1 ) * this.zStep
      this.position.z = z + 400
      TweenLite.to( this.position, .6, {
        delay: ( this.z - zStop ) * .3,
        z: z,
        ease: Cubic.easeOut
      })
    }
  }

  disableShadows() {
    this.castShadow = false
    this.customDepthMaterial = null
  }

  clean() {
    super.clean()

    TweenLite.killTweensOf( this.position )

    if( !this.pool ) {
      this.pool = require( "./elementsPools" )
    }
    this.pool.square.release( this )
  }

}

module.exports = SquareElement
