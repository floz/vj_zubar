class BaseStyle {

  constructor( cnt, x, y, w, h, subdivisionFactor, subdivisionCount ) {
    this.cnt = cnt
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.subdivisionFactor = subdivisionFactor
    this.subdivisionCount = subdivisionCount

    this.canSubdivide = false
  }

  subdivide() {
  }

  draw( ctx ) {

  }

  show( delay ) {

  }

  disableShadows() {
    if( this.element ) {
      this.element.disableShadows()
    }
    if( this.elements ) {
      for( let i = 0, n = this.elements.length; i < n; i++ ) {
        this.elements[ i ].disableShadows()
      }
    }
    if( this.zone ) {
      this.zone.disableShadows()
    }
    if( this.zones ) {
      for( let i = 0, n = this.zones.length; i < n; i++ ) {
        this.zones[ i ].disableShadows()
      }
    }
  }

  getElements() {
    let elements = []
    if( this.element ) {
      elements.push( this.element )
    }
    if( this.elements ) {
      elements = elements.concat( this.elements )
    }
    if( this.zone ) {
      elements = elements.concat( this.zone.getElements() )
    }
    if( this.zones ) {
      for( let i = 0, n = this.zones.length; i < n; i++ ) {
        elements = elements.concat( this.zones[ i ].getElements() )
      }
    }

    return elements
  }

  regenerate( zStop ) {
    if( this.zone ) {
      this.zone.regenerate( zStop )
    }
    if( this.zones ) {
      for( let i = 0, n = this.zones.length; i < n; i++ ) {
        this.zones[ i ].regenerate( zStop )
      }
    }
  }

  clean() {
    if( this.element ) {
      this.element.clean()
    }
    if( this.elements ) {
      for( let i = 0, n = this.elements.length; i < n; i++ ) {
        this.elements[ i ].clean()
      }
    }
    if( this.zone ) {
      this.zone.clean()
    }
    if( this.zones ) {
      for( let i = 0, n = this.zones.length; i < n; i++ ) {
        this.zones[ i ].clean()
      }
    }
  }

  refreshColors() {
    if( this.element ) {
      this.element.refreshColors()
    }
    if( this.elements ) {
      for( let i = 0, n = this.elements.length; i < n; i++ ) {
        this.elements[ i ].refreshColors()
      }
    }
    if( this.zone ) {
      this.zone.refreshColors()
    }
    if( this.zones ) {
      for( let i = 0, n = this.zones.length; i < n; i++ ) {
        this.zones[ i ].refreshColors()
      }
    }
  }

}

module.exports = BaseStyle
