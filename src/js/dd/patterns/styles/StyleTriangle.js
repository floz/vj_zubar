const BaseStyle = require( "./BaseStyle" )
const TriangleElement = require( "../elements/TriangleElement" )
const elementsPools = require( "../elements/elementsPools" )

class StyleTriangle extends BaseStyle {

  constructor( cnt, x, y, w, h, subdivisionFactor, subdivisionCount ) {
    super( cnt, x, y, w, h, subdivisionFactor, subdivisionCount )

    this.canSubdivide = false

    this.generate()
  }

  generate() {
    const s = Math.random() < .5 ? "a" : "b"
    this.element = elementsPools.triangle.get()
    this.element.init( this.x, this.y, this.subdivisionCount, this.w, this.h, this.getColor(), this.getColor(), s )
    const radRotate = Math.random() * 4 >> 0
    this.element.rotation.z = Math.PI * .5 * radRotate
    this.cnt.add( this.element )
  }

  draw( ctx ) {
    // this.element.draw( ctx )
  }

  show( delay ) {
    // this.element.show( delay )
  }

  getColor() {
    const hue = Math.random() * 255 + 170 % 360
    const sat = 100
    const lum = 75
    return "hsl( " + hue + ", " + sat + "%, " + lum + "% )"
  }

}

module.exports = StyleTriangle
