const styleFactory = require( "./styles/styleFactory" )

class PatternGenerator {

  constructor( cnt, x, y, w, h, subdivisionFactor, subdivisionCount = 0 ) {
    this.cnt = cnt
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.subdivisionFactor = subdivisionFactor
    this.subdivisionCount = subdivisionCount

    this.createStyle()
  }

  createStyle() {
    this.style = styleFactory.get( this.cnt, this.x, this.y, this.w, this.h, this.subdivisionFactor, this.subdivisionCount + 1 )
    this.style.generator = this
    if( this.style.canSubdivide ) {
      this.style.subdivide()
    }
  }

  draw( ctx ) {

  }

  show( delay = 0 ) {

  }

  // regenerate() {
  //   this.subdivisionFactor = 1
  //   this.subdivisionCount = 0
  //
  //   this.style = styleFactory.get( this.x, this.y, this.w, this.h, this.subdivisionFactor, this.subdivisionCount + 1 )
  //   if( this.style.canSubdivide ) {
  //     this.style.subdivide()
  //   }
  // }

  regenerate( zStop ) {
    if( this.subdivisionCount >= zStop ) {
      this.style.clean()
      this.createStyle()
    } else {
      this.style.regenerate( zStop )
    }
  }

  clean() {
    this.style.clean()
  }

  disableShadows() {
    this.style.disableShadows()
  }

  getElements() {
    return this.style.getElements()
  }

  refreshColors() {
    this.style.refreshColors()
  }

}

module.exports = PatternGenerator
