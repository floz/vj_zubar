const BaseStyle = require( "./BaseStyle" )
const PatternConfig = require( "../PatternConfig" )
// const SquareElement = require( "../elements/SquareElement" )
const elementsPools = require( "../elements/elementsPools" )

class StyleBorder extends BaseStyle {

  constructor( cnt, x, y, w, h, subdivisionFactor, subdivisionCount ) {
    super( cnt, x, y, w, h, subdivisionFactor, subdivisionCount )

    this.canSubdivide = this.subdivisionCount < 3

    const hue = Math.random() * 255 + 170 % 360
    const sat = 100
    const lum = 50
    const col = "hsl( " + hue + ", " + sat + "%, " + lum + "% )"

    // this.element = new SquareElement()
    this.element = elementsPools.square.get()
    this.element.init( x, y, this.subdivisionCount, w, h, col )
    this.cnt.add( this.element )
  }

  subdivide() {
    const PatternGenerator = require( "../PatternGenerator" )

    const w = this.w * .8
    const h = this.h * .8
    const x = this.x// + this.w * .1
    const y = this.y// + this.h * .1
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

module.exports = StyleBorder
