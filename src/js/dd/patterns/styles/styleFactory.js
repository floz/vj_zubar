const Style4 = require( "./Style4" )
const StyleBorder = require( "./StyleBorder" )
const StyleDecal = require( "./StyleDecal" )
const StyleCenter = require( "./StyleCenter" )
const StyleCircles = require( "./StyleCircles" )
const StyleTriangle = require( "./StyleTriangle" )

class StyleFactory {

  constructor() {
    this.divideDefX = 2
    this.divideDefY = 2
  }

  getStyle( subdivisionCount ) {
    // First pass
    if( subdivisionCount == 1 && Math.random() > .25 ) {
      if( Math.random() < .5 ) {
        return StyleBorder
      } else {
        return StyleDecal
      }
      // Others pass
    } else {
      // Sort by subdivisionCount
      if( subdivisionCount > 1 && subdivisionCount <= 2 ) {
        let rand = Math.random() * .5
        if( rand < .35 ) {
          return Style4
        } else {
          return StyleCenter
        }
      } else if( subdivisionCount > 2 && subdivisionCount <= 4 ) {
        let rand = Math.random() * .5
        if( rand < .45 ) {
          return Style4
        } else if( rand >= .35 && rand <= .45 ) {
          return StyleTriangle
        } else {
          if( Math.random() < .5 ) {
            return StyleCenter
          } else {
            return StyleBorder
          }
        }
      } else if(  subdivisionCount > 4 && subdivisionCount < 7 ) {
        let rand = Math.random()
        if( rand < .085 ) {
          return StyleTriangle
        } else if( rand >= .085 && rand < .185 ) {
          return StyleTriangle
        } else {
          return Style4
        }
      } else {
        return Style4
      }
    }
  }

  get( cnt, x, y, w, h, subdivisionFactor, subdivisionCount ) {
    const c = this.getStyle( subdivisionCount )
    const style = new c( cnt, x, y, w, h, subdivisionFactor, subdivisionCount )
    if( c == Style4 ) {
      style.divideDefX = this.divideDefX
      style.divideDefY = this.divideDefY
    }
    return style
  }

  setDivideDefinition( x, y ) {
    this.divideDefX = x
    this.divideDefY = y
  }

}

module.exports = new StyleFactory()
