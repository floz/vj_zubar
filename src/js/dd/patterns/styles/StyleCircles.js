const BaseStyle = require( "./BaseStyle" )
const PatternConfig = require( "../PatternConfig" )
// const CircleElement = require( "../elements/CircleElement" )
// const SquareElement = require( "../elements/SquareElement" )
const elementsPools = require( "../elements/elementsPools" )

class StyleCircles extends BaseStyle {

  constructor( cnt, x, y, w, h, subdivisionFactor, subdivisionCount ) {
    super( cnt, x, y, w, h, subdivisionFactor, subdivisionCount )

    this.canSubdivide = false

    this.elements = []
    const element = elementsPools.square.get()
    element.init( this.x, this.y, this.subdivisionCount, this.w, this.h, this.getColor() )
    this.cnt.add( element )
    this.elements.push( element )

    this.generateCircles()
  }

  generateCircles() {
    const radAdd = ( Math.PI * 2 ) / 4
    let rad1 = Math.PI / 4
    let rad2 = rad1 + radAdd
    let rad3 = rad2 + radAdd
    let rad4 = rad3 + radAdd
    let rad5 = 0

    const rads = []
    const rand = Math.random()
    if( rand > .85 ) {
      rads.push( rad1 )
      rads.push( rad3 )
    } else if ( rand > .7 && rand <= .85 ) {
      rads.push( rad2 )
      rads.push( rad4 )
    } else if ( rand > .5 && rand <= .7 ) {
      rads.push( rad1 )
      rads.push( rad2 )
      rads.push( rad3 )
      rads.push( rad4 )
    } else if ( rand > .3 && rand <= .5 ) {
      rads.push( rad5 )
    } else if ( rand > .1 && rand <= .3 ) {
      rads.push( rad1 )
      rads.push( rad2 )
      rads.push( rad3 )
      rads.push( rad4 )
      rads.push( rad5 )
    } else {
      rads.push( rad1 )
      rads.push( rad3 )
      rads.push( rad5 )
    }

    const rCircle = this.w * .4

    const radius = this.w * .35
    for( let i = 0, n = rads.length; i < n; i++ ) {
      let rad = rads[ i ]
      let x = this.x // + this.w * .5
      let y = this.y // + this.h * .5
      if( rad != 0 ) {
        x += radius * Math.cos( rad )
        y += radius * Math.sin( rad )
      }

      let element = elementsPools.circle.get()
      element.init( x, y, this.subdivisionCount + .5, rCircle, this.getColor() )
      this.cnt.add( element )
      this.elements.push( element )
    }
  }

  draw( ctx ) {
    // for( let i = 0, n = this.elements.length; i < n; i++ ) {
    //   this.elements[ i ].draw( ctx )
    // }
  }

  show( delay ) {
    // let d = delay + PatternConfig.delayAdd
    // for( let i = 0, n = this.elements.length; i < n; i++ ) {
    //   this.elements[ i ].show( d )
    //   d += .05
    // }
  }

  getColor() {
    const hue = Math.random() * 255 + 170 % 360
    const sat = 100
    const lum = 50
    return "hsl( " + hue + ", " + sat + "%, " + lum + "% )"
  }

}

module.exports = StyleCircles
