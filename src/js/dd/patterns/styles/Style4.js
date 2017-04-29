const BaseStyle = require( "./BaseStyle" )
const PatternConfig = require( "../PatternConfig" )
const SquareElement = require( "../elements/SquareElement" )
const elementsPools = require( "../elements/elementsPools" )

class Style4 extends BaseStyle {

  constructor( cnt, x, y, w, h, subdivisionFactor, subdivisionCount ) {
    super( cnt, x, y, w, h, subdivisionFactor, subdivisionCount )

    this.maxSubdiv = 8
    this.canSubdivide = this.subdivisionCount < this.maxSubdiv && Math.random() < subdivisionFactor
    // this.canSubdivide = this.subdivisionCount < 3 && Math.random() < subdivisionFactor

    const hue = Math.random() * 255 + 170 % 360
    const sat = 100
    const lum = 50
    const col = "hsl( " + hue + ", " + sat + "%, " + lum + "% )"

    this.element = elementsPools.square.get()
    this.element.init( x, y, this.subdivisionCount, w, h, col )
    this.cnt.add( this.element )

    this.divideDefX = 2
    this.divideDefY = 2
  }

  subdivide() {
    this.zones = []

    const PatternGenerator = require( "../PatternGenerator" )

    let decalX = 0
    if( this.divideDefX > 1 ) {
      decalX = this.w * ( .5 / this.divideDefX )
    }
    let decalY = 0
    if( this.divideDefY > 1 ) {
      decalY = this.h * ( .5 / this.divideDefY )
    }
    // let stepsx = 2
    // let stepsy = 2
    let px = this.x - decalX
    let py = this.y - decalY
    let dx = this.w / this.divideDefX
    let dy = this.h / this.divideDefY
    for( let x = 0, xmax = this.divideDefX; x < xmax; x++ ) {
      for( let y = 0, ymax = this.divideDefY; y < ymax; y++ ) {
        let zone = new PatternGenerator( this.cnt, px, py, dx, dy, this.subdivisionFactor * .875, this.subdivisionCount )
        this.zones.push( zone )

        py += dy
      }
      px += dx
      py = this.y - decalY
    }
  }

  draw( ctx ) {
    // this.element.draw( ctx )
    //
    // if( !this.zones ) {
    //   return
    // }
    //
    // for( let i = 0, n = this.zones.length; i < n; i++ ) {
    //   let zone = this.zones[ i ]
    //   zone.draw( ctx )
    // }
  }

  show( delay ) {
    // let d = delay + PatternConfig.delayAdd
    // this.element.show( delay )
    //
    // if( this.zones ) {
    //   for( let i = 0, n = this.zones.length; i < n; i++ ) {
    //     let zone = this.zones[ i ]
    //     zone.show( d )
    //
    //     d += PatternConfig.delayAdd * .325
    //   }
    // }
  }

}

module.exports = Style4
