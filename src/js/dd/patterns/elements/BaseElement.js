const colors = require( "dd/core/colors" )
const timeout = require( "mnf/utils/timeout" )

class BaseElement extends THREE.Mesh {

  constructor( geo, mat ) {
    super( geo, mat )

    this.isShown = false
  }

  setZStep( value ) {
    this.zStep = value
    this.position.z = ( ( this.z - 1 ) ) * this.zStep
  }

  show( zStop = 0 ) {
    if( this.isShown ) {
      return
    }
    this.isShown = true
    TweenLite.to( this.material.uniforms.opacity, .25, {
      value: 1,
      ease: Cubic.easeOut
    } )

    TweenLite.to( this.scale, .6, {
      delay: ( this.z - zStop ) * .3,
      x: this.w,
      y: this.h,
      ease: Math.random() < ( this.z / 8 ) ? Cubic.easeOut : Cubic.easeInOut
    } )
  }

  hide( isInstant = false ) {
    if( isInstant ) {
      this.material.uniforms.opacity.value = 0
      this.scale.x =
      this.scale.y = .001
      this.isShown = false
    }
  }

  disableShadows() {
    this.castShadow = false
    this.customDepthMaterial = null
  }

  clean() {
    this.parent.remove( this )

    TweenLite.killTweensOf( this.material.uniforms.opacity )
    TweenLite.killTweensOf( this.scale )

    if( this.tiMat ) {
      timeout.clear( this.tiMat )
    }
    if( this.tiBg ) {
      timeout.clear( this.tiBg )
    }
  }

  refreshColors() {
    if( this.tiMat ) {
      timeout.clear( this.tiMat )
    }
    this.tiMat = timeout( () => {
      const z = ( ( this.z - 1 ) ) * this.zStep
      this.position.z = z + 50 + Math.random() * 50
      TweenLite.killTweensOf( this.position )
      TweenLite.to( this.position, .25, {
        z: z,
        ease: Cubic.easeOut
      } )
      const colorMat = colors.get()
      this.material.uniforms.color.value = colorMat
    }, 250 * ( 1. - ( this.z - 1 ) / 8 ) )

    if( this.tiBg ) {
      timeout.clear( this.tiBg )
    }
    this.tiBg = timeout( () => {
      const colorBg = colors.getFog()
      this.material.uniforms.bgColor.value = colorBg
    }, 250 * ( 1. - ( this.z - 1 ) / 8 ) )
  }

}

module.exports = BaseElement
