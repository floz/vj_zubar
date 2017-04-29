const BaseStyle = require( "./BaseStyle" )
const PatternConfig = require( "../PatternConfig" )
const elementsPools = require( "../elements/elementsPools" )

class StyleDecal extends BaseStyle {

  constructor( cnt, x, y, w, h, subdivisionFactor, subdivisionCount ) {
    super( cnt, x, y, w, h, subdivisionFactor, subdivisionCount )

    this.canSubdivide = this.subdivisionCount < 2

    const hue = Math.random() * 255 + 170 % 360
    const sat = 100
    const lum = 50
    const col = "hsl( " + hue + ", " + sat + "%, " + lum + "% )"

    this.element = elementsPools.square.get()
    this.element.init( x, y, this.subdivisionCount, w, h, col )
    this.cnt.add( this.element )
  }

  subdivide() {
    const PatternGenerator = require( "../PatternGenerator" )

    const w = this.w * .9
    const h = this.h * .9
    let x = this.x
    let y = this.y
    const rand = Math.random()
    if( rand > .25 && rand <= .5 ) {
      x += this.w * .05
      y -= this.h * .05
    } else if ( rand > .5 && rand <= .75 ) {
      x += this.w * .05
      y += this.h * .05
    } else if ( rand > .75 ) {
      x -= this.w * .05
      y += this.h * .05
    } else {
      x -= this.w * .05
      y -= this.h * .05
    }
    this.zone = new PatternGenerator( this.cnt, x, y, w, h, this.subdivisionFactor, this.subdivisionCount )
  }

  draw( ctx ) {
    // this.element.draw( ctx )
    //
    // if( this.zone ) {
    //   this.zone.draw( ctx )
    // }
  }

  show( delay ) {
    // let d = delay + PatternConfig.delayAdd
    // this.element.show( delay )
    //
    // if( this.zone ) {
    //   this.zone.show( d )
    // }
  }

}

module.exports = StyleDecal
