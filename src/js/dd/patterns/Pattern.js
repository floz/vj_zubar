const PatternGenerator = require( "./PatternGenerator" )
const gui = require( "mnf/utils/gui" )

let IDX = 0

class Pattern extends THREE.Group {

  constructor( x, y, w, h, subdivisionCount = 0 ) {
    super()

    this.name = "Pattern" + IDX

    this.generator = new PatternGenerator( this, x, y, w, h, 1, subdivisionCount )
    this.elements = this.generator.getElements()
    this.hideElements()

    this.flipCount = 0

    this.zStep = 1
    this.refreshZStep()

    this.zStopToRefresh = 4

    IDX++
  }

  flip() {
    this.rotation.z = this.flipCount * Math.PI + Math.PI * .75
    this.flipCount++
    TweenLite.to( this.rotation, .6, {
      z: this.flipCount * Math.PI,
      ease: Cubic.easeOut
    })
  }

  flip2() {
    this.flipCount++
    TweenLite.to( this.rotation, .6, {
      z: ( this.flipCount % 2 ) * Math.PI,
      ease: Cubic.easeOut
    })
  }

  regenerate() {
    this.zStopToRefresh >>= 0
    this.generator.regenerate( this.zStopToRefresh )
    this.elements = this.generator.getElements()
    this.refreshZStep()
    this.hideElements( this.zStopToRefresh )
    this.show( this.zStopToRefresh )
  }

  show = ( zStop = 0 ) => {
    for( let i = 0, n = this.elements.length; i < n; i++ ) {
      if( this.elements[ i ].z >= zStop ) {
        this.elements[ i ].show( zStop )
      }
    }
  }

  refreshZStep = () => {
    for( let i = 0, n = this.elements.length; i < n; i++ ) {
      this.elements[ i ].setZStep( this.zStep )
    }
  }

  disableShadows() {
    this.generator.disableShadows()
  }

  hideElements( zStop = 0 ) {
    for( let i = 0, n = this.elements.length; i < n; i++ ) {
      if( this.elements[ i ].z >= zStop ) {
        this.elements[ i ].hide( true )
      }
    }
  }

  refreshColors() {
    this.generator.refreshColors()
  }

}

module.exports = Pattern
