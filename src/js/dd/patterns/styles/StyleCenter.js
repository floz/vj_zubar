const BaseStyle = require( "./BaseStyle" )
const PatternConfig = require( "../PatternConfig" )
// const SquareElement = require( "../elements/SquareElement" )
const elementsPools = require( "../elements/elementsPools" )

class StyleCenter extends BaseStyle {

  constructor( cnt, x, y, w, h, subdivisionFactor, subdivisionCount ) {
    super( cnt, x, y, w, h, subdivisionFactor, subdivisionCount )

    this.maxSubdiv = 6
    this.canSubdivide = this.subdivisionCount < this.maxSubdiv && Math.random() < subdivisionFactor

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

    let centerRatio = 1 - Math.max( .15, Math.random() * .4 )

    const w = this.w * centerRatio
    const h = this.h * centerRatio
    const x = this.x
    const y = this.y
    this.zone = new PatternGenerator( this.cnt, x, y, w, h, this.subdivisionFactor * .95, this.subdivisionCount )
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

module.exports = StyleCenter
