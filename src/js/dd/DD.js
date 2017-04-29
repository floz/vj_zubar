const stage = require( "mnf/core/stage" )
const stage3d = require( "mnf/core/stage3d" )
const gui = require( "mnf/utils/gui" )

const colors = require( "dd/core/colors" )
const PostProcessPass = require( "dd/postprocess/PostProcessPass" )
const Pattern = require( "dd/patterns/Pattern" )
const styleFactory = require( "dd/patterns/styles/styleFactory" )
const Floor = require( "dd/scene/Floor" )

const timeout = require( "mnf/utils/timeout" )
const keyboard = require( "mnf/utils/keyboard" )

const audio = require( "mnf/core/audio" )
const midi = require( "mnf/midi/midi" )

class DD {

  constructor( fCamera ) {
    this.stepScenar = 0

    stage3d.initPostProcessing()

    this.volumeMax = 10

    this.bloomPass = new WAGNER.MultiPassBloomPass(512,512)
    this.bloomPass.params.applyZoomBlur = false;
    this.bloomPass.params.blurAmount = .9;
    this.bloomPass.params.opacity = .7;
    // stage3d.addPass(this.bloomPass)
    const bloomgui = gui.addFolder('bloom')
    bloomgui.add(this.bloomPass.blendPass.params,'opacity', 0, 1)
    bloomgui.add(this.bloomPass.blendPass.params,'mode', 0, 23, 1)
    bloomgui.add(this.bloomPass.params,'applyZoomBlur')
    bloomgui.add(this.bloomPass.params,'zoomBlurStrength',0,1)
    bloomgui.add(this.bloomPass.params,'blurAmount',0,1)
    this.bloomPass2 = new WAGNER.MultiPassBloomPass(256,256)
    this.bloomPass2.params.applyZoomBlur = true;
    this.bloomPass2.params.zoomBlurStrength = .1;
    this.bloomPass2.params.blurAmount = 1;
    this.bloomPass2.params.opacity = .6;
    // stage3d.addPass(this.bloomPass2)
    const bloom2gui = gui.addFolder('bloom2')
    bloom2gui.add(this.bloomPass2.blendPass.params,'opacity', 0, 1)
    bloom2gui.add(this.bloomPass2.blendPass.params,'mode', 0, 23, 1)
    bloom2gui.add(this.bloomPass2.params,'applyZoomBlur')
    bloom2gui.add(this.bloomPass2.params,'zoomBlurStrength',0,1)
    bloom2gui.add(this.bloomPass2.params,'blurAmount',0,1)
    // stage3d.addPass(new WAGNER.FXAAPass())

    this.fxaa = new WAGNER.FXAAPass()

		stage3d.addPass( this.postProcess = new PostProcessPass() )

    this.sceneHUE = 216
    colors.set( this.sceneHUE )
    const fGlobal = gui.addFolder( "Global" )
    fGlobal.add( this, "sceneHUE", 0, 360 ).onChange( this.updateSceneColor )

    stage3d.scene.fog.color = colors.getFog()
    stage3d.renderer.setClearColor( colors.getFog() )


    // lights

    const o = {}
    // o.ambientColor = 0x2d415f
    // o.spotLightColor = 0x0f1625
    o.containerOrientation1 = () => {
      this.container.position.set( 0, 0, 0 )
      this.container.rotation.set( .001, .001, 0.001 )
    }
    o.containerOrientation2 = () => {
      this.container.position.x = 34
      this.container.rotation.set( .001, .001, 0.6697 )
    }
    o.containerOrientation3 = () => {
      this.container.position.x = 34
      this.container.rotation.set( .001, .001, 0.001 )
    }

    fCamera.add( o, "containerOrientation1" )
    fCamera.add( o, "containerOrientation2" )

    const ambient = new THREE.AmbientLight( colors.getAmbient() )
    stage3d.add( ambient )
    this.ambient = ambient

    const spotLight = new THREE.SpotLight( colors.getSpotLight() )
    spotLight.name = 'MainLight'
    // spotLight.angle = 2.6 //
    spotLight.angle =  .9
    spotLight.intensity = 0.45
    spotLight.penumbra = 0.39
    spotLight.position.set( 0, 66, 320 )
    spotLight.lookAt( new THREE.Vector3() )
    spotLight.castShadow = true
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.bias = -0.01
    spotLight.shadow.darkness = 0.1
    stage3d.add( spotLight )
    this.spotLight = spotLight

    const fLight = gui.addFolder( "SpotLight" )
    fLight.add( spotLight, "angle", 0, Math.PI * 2 )
    fLight.add( spotLight, "penumbra", 0, 2 )
    fLight.add( spotLight, "intensity", 0, 1 )
    fLight.add( spotLight, "decay", 0, 2000 )
    fLight.add( spotLight.shadow.camera, "near", 0, 100 )
    fLight.add( spotLight.shadow.camera, "far", 0, 4000 )
    fLight.add( spotLight, "distance", 0, 300 )
    fLight.add( spotLight.position, "y", 0, 1000 )
    fLight.add( spotLight.position, "z", 0, 1000 )

    // elements

    this.container = new THREE.Group()
    this.container.rotation.set( .001, .001, 0.001 )
    stage3d.add( this.container )

    styleFactory.setDivideDefinition( 2, 2 )

    this.containerPatterns = new THREE.Group()
    this.container.add( this.containerPatterns )

    this.patternSerieCnt = new THREE.Group()

    // this.createTower()
    // this.createFive()
    // this.createElevation()
    // this.createTunnel()
    // this.createCentered()

    this.patterns = []

    this.patternsPool = []
    for( let i = 0, n = 6; i < n; i++ ) {
      let pattern = new Pattern( 0, 0, 400, 400 )
      this.patternsPool.push( pattern )
    }

    // audio.onCanPlay.add( this.onCanPlay )

    this.floor = new Floor()
    this.floor.position.z = -140
    this.container.add( this.floor )

    const fFloor = gui.addFolder( "Floor" )
    fFloor.add( this.floor.position, "z", -1000, 0 )
    // fFloor.open()

    const fContainer = gui.addFolder( "Container" )
    fContainer.add( this.container.position, "x", -200, 200 )
    fContainer.add( this.container.position, "y", -200, 200 )
    fContainer.add( this.container.position, "z", -200, 200 )
    fContainer.add( this.container.rotation, "x", -Math.PI, Math.PI )
    fContainer.add( this.container.rotation, "y", -Math.PI, Math.PI )
    fContainer.add( this.container.rotation, "z", -Math.PI, Math.PI )
    // fContainer.open()

    const fContainerPatterns = gui.addFolder( "ContainerPatterns" )
    fContainerPatterns.add( this.containerPatterns.position, "x", -200, 200 )
    fContainerPatterns.add( this.containerPatterns.position, "y", -200, 200 )
    fContainerPatterns.add( this.containerPatterns.position, "z", -200, 200 )
    fContainerPatterns.add( this.containerPatterns.rotation, "x", -Math.PI, Math.PI )
    fContainerPatterns.add( this.containerPatterns.rotation, "y", -Math.PI, Math.PI )
    fContainerPatterns.add( this.containerPatterns.rotation, "z", -Math.PI, Math.PI )
    // fContainerPatterns.open()

    this.zStep = 1
    this.isColorRefreshingByVolume = true

    // audio.start( { live: true, playlist: [ "mp3/porterrobinsonshelter2.mp3" ] } )
    audio.start()
    audio.onBeat.add( this.onBeat )

    stage.onUpdate.add( this.onUpdate )

    this.canRefreshByVolume = true
    this.checkRefreshByVolume()

    this.postProcess.toStart()
    this.switchToSolo()

    keyboard.onDown.add( this.onKeyboardDown )
    midi.onInit.addOnce( this.onMidiInit )
  }

  onMidiInit = () => {
    midi.pg.buttons.green.onAction.add( this.onButtonGreenAction )
  }

  onButtonGreenAction = ( value ) => {
    if( value == "pressed" ) {
      this.sceneHUE = Math.random() * 360 >> 0
      this.updateSceneColor()
    }
  }

  onKeyboardDown = ( key ) => {
    if( key == 65 ) { // a
      this.isColorRefreshingByVolume = !this.isColorRefreshingByVolume
    }
    else if ( key == 32 ) { // space
      this.sceneHUE = Math.random() * 360 >> 0
      this.updateSceneColor()
    }
    else if ( key == 80 ) { // p
      this.prepareGlitchSwitch()
      timeout( () => {
        this.createSerie()
      }, 200 )
    }
    else if ( key == 49 ) { // 1 !
      stage3d.control.radius = stage3d.control._radius = 1200
      stage3d.control._phi = Math.PI * .5
			stage3d.control._theta = Math.PI * .5
      this.container.position.x = 0
      this.container.position.y = 0
      this.container.position.z = 0
      this.postProcess.params.mirrorX = false
      this.postProcess.params.mirrorY = false
      this.postProcess.params.sectionsKaleid = 0
    }
    else if ( key == 50 ) { // 2 @
      stage3d.control.radius = stage3d.control._radius = 1200
      stage3d.control._phi = Math.PI * .8
			stage3d.control._theta = Math.PI * .5
      this.container.position.x = 0
      this.container.position.y = -100
      this.container.position.z = 0
      this.postProcess.params.mirrorX = false
      this.postProcess.params.mirrorY = false
      // this.postProcess.params.sectionsKaleid = 0
    }
    else if ( key == 51 ) { // 3
      stage3d.control._phi = Math.PI * .8
			stage3d.control._theta = Math.PI * .5
      stage3d.control.radius = stage3d.control._radius = 800
      this.container.position.x = 0
      this.container.position.y = -100
      this.container.position.z = 0
      this.postProcess.params.mirrorX = true
      this.postProcess.params.mirrorY = true
      // this.postProcess.params.sectionsKaleid = 0
    }
    else if ( key == 52 ) { // 4
      stage3d.control.radius = stage3d.control._radius = 1200
      stage3d.control._phi = Math.PI * .8
			stage3d.control._theta = Math.PI * .5
      this.container.position.x = 0
      this.container.position.y = -100
      this.container.position.z = 0
      this.postProcess.params.mirrorX = true
      this.postProcess.params.mirrorY = false
      // this.postProcess.params.sectionsKaleid = 0
    }
    else if ( key == 53 ) { // 5
      stage3d.control.radius = stage3d.control._radius = 600
      stage3d.control._phi = Math.PI * .5
			stage3d.control._theta = Math.PI * .5
      this.container.position.x = 0
      this.container.position.y = 0
      this.container.position.z = 0
      this.postProcess.params.mirrorX = true
      this.postProcess.params.mirrorY = false
      this.postProcess.params.sectionsKaleid = 4
    }
    else if ( key == 54 ) { // 6
      stage3d.control.radius = stage3d.control._radius = 600
      stage3d.control._phi = Math.PI * .5
			stage3d.control._theta = Math.PI * .5
      this.container.position.x = 0
      this.container.position.y = 0
      this.container.position.z = 0
      this.postProcess.params.mirrorX = true
      this.postProcess.params.mirrorY = false
      this.postProcess.params.sectionsKaleid = 8
    }
    else if ( key == 55 ) {
      if( !this.hasFXPass ) {
        stage3d.addPassFirst(this.fxaa)
        stage3d.addPassFirst(this.bloomPass2)
        stage3d.addPassFirst(this.bloomPass)
        this.hasFXPass = true
        this.postProcess.params.gamma = .16
      } else {
        stage3d.removePass(this.bloomPass)
        stage3d.removePass(this.bloomPass2)
        stage3d.removePass(this.fxaa)
        this.hasFXPass = false
        this.postProcess.params.gamma = .85
      }
    }
    else if ( key == 57 ) { // 9
      this.postProcess.params.mirrorX = !this.postProcess.params.mirrorX
    }
    else if ( key == 48 ) { // 0
      this.postProcess.params.mirrorY = !this.postProcess.params.mirrorY
    }
    else if ( key == 81 ) { // q
      if( !this.isTurned ) {
        this.container.position.x = 34
        this.container.rotation.set( .001, .001, 0.6697 )
        this.isTurned = true
      } else {
        this.container.position.set( 0, 0, 0 )
        this.container.rotation.set( .001, .001, 0.001 )
        this.isTurned = false
      }
    }
    else if ( key == 76 ) { // L
      this.postProcess.params.glitchOffsetX = 2 + Math.random() * 10
  		this.postProcess.params.glitchOffsetY = 2 + Math.random() * 10
  		this.glitchRatio = 1
      this.mode = "custom"
    }
    else if ( key == 75 ) { // K
      this.postProcess.params.glitchOffsetX = 1 + Math.random() * 4
  		this.postProcess.params.glitchOffsetY = 1 + Math.random() * 4
  		this.glitchRatio = 1
      this.mode = "custom"
    }
    else if ( key == 74 ) { // J
      this.postProcess.params.glitchOffsetX = 2
  		this.postProcess.params.glitchOffsetY = 2
  		this.glitchRatio = .5
      this.mode = "custom"
    }
    else if ( key == 72 ) { // H
      this.postProcess.params.glitchOffsetX = 0
  		this.postProcess.params.glitchOffsetY = 0
  		this.glitchRatio = 0
      this.mode = "custom"
    }
    else if ( key == 79 ) { // O
      this.prepareGlitchSwitch()
      timeout( () => {
        this.createFive()
      }, 400 )

      this.mode = "five"
      stage3d.control.radius = stage3d.control._radius = 1200
    }
    else if ( key == 73 ) { // I
      this.prepareGlitchSwitch()
      timeout( () => {
        this.switchToSolo()
      }, 400 )
    }
    else if ( key == 85 ) { // I
      this.prepareGlitchSwitch()
      timeout( () => {
        this.createCube()
      }, 400 )
    }
    else if ( key == 13 ) { //enter
      this.refreshPatterns()
    }
    else if ( key == 77 ) { // m
      for( let i = 0, n = this.patterns.length; i < n; i++ ) {
        this.patterns[ i ].flip()
      }
    }
    else if ( key == 222 ) {
      if( this.postProcess.params.gamma == .01 ) {
        this.postProcess.params.gamma = .11
      } else {
        this.postProcess.params.gamma = .01
      }
    }
  }

  checkRefreshByVolume = () => {
    timeout( () => {
      this.canRefreshByVolume = true
      this.checkRefreshByVolume()
    }, Math.random() * 1500 + 500 )
  }

  updateSceneColor = () => {
    this.sceneHUE >>= 0
    this.sceneHUE = this.sceneHUE % 360
    colors.set( this.sceneHUE )

    stage3d.scene.fog.color = colors.getFog()
    stage3d.renderer.setClearColor( stage3d.scene.fog.color )

    this.tweenColorTo( this.ambient.color, colors.getAmbient() )
    this.tweenColorTo( this.spotLight.color, colors.getSpotLight() )

    // this.pattern.refreshColors()
    for( let i = 0, n = this.patterns.length; i < n; i++ ) {
      this.patterns[ i ].refreshColors()
    }

    // this.floor.setColor( colors.getFloor() )
  }

  tweenColorTo( base, to ) {
    const hslTo = to.getHSL()
    const hslCurr = base.getHSL()

    base.setHSL( hslTo.h, hslTo.s, hslTo.l )
  }

  createTower() {
    this.prepareSwitch()

    let pz = 0
    let size = 800
    let towerLength = 4
    let diffSize = 400
    let sizeStep = diffSize / towerLength

    this.patterns = []

    for( let i = 0, n = towerLength; i < n; i++ ) {
      let pattern = this.patternsPool[ i ]
      pattern.position.y = 75
      pattern.position.z = 100 + pz
      this.containerPatterns.add( pattern )
      if( i > 1 ) {
        pattern.disableShadows()
      }
      pattern.show()
      this.patterns.push( pattern )

      pz += 100
      size -= sizeStep
    }
  }

  createFive() {
    this.prepareSwitch()

    this.mode = "five"
    stage3d.control.radius = stage3d.control._radius = 2000

    this.fiveRadius = [ 1500, 2000, 2500 ]

    const size = 600
    const pos = [
      [ 0, 0 ],
      [ -size, -size ],
      [ size, -size ],
      [ -size, size ],
      [ size, size ]
    ]

    this.patterns = []

    for( let i = 0, n = pos.length; i < n; i++ ) {
      let posCurr = pos[ i ]

      let pattern = this.patternsPool[ i ]
      pattern.position.x = posCurr[ 0 ]
      pattern.position.y = posCurr[ 1 ]
      pattern.position.z = -50
      pattern.show()
      // pattern.disableShadows()
      this.containerPatterns.add( pattern )

      this.patterns.push( pattern )
    }
  }

  createElevation() {
    this.prepareSwitch()

    this.mode = "elevation"

    const data = [
      [ -300, 150, -50, 800 ],
      [ -200, -200, 50, 400 ],
      [ 200, 200, 50, 400 ],
      [ 400, -200, 100, 100 ],
      [ -400, 700, 100, 300 ],
      [ -200, 200, 150, 200 ]
    ]

    this.patterns = []

    for( let i = 0, n = data.length; i < n; i++ ) {
      let dataCurr = data[ i ]

      let pattern = this.patternsPool[ i ]
      pattern.position.x = dataCurr[ 0 ]
      pattern.position.y = dataCurr[ 1 ]
      pattern.position.z = dataCurr[ 2 ]
      if( i > 1 ) {
        pattern.disableShadows()
      }
      pattern.show()
      this.containerPatterns.add( pattern )

      this.patterns.push( pattern )
    }
  }

  createCube() {
    this.prepareSwitch()

    this.mode = "cube"

    stage3d.control.radius = stage3d.control._radius = 2500

    this.containerPatterns.position.z = 300
    this.spotLight.position.z = 860
    this.spotLight.intensity = .65

    let pattern = this.patternsPool[ 0 ]
    pattern.position.z = 200
    pattern.show()
    this.containerPatterns.add( pattern )
    this.patterns.push( pattern )

    pattern = this.patternsPool[ 1 ]
    pattern.position.x = -300
    pattern.rotation.y = -Math.PI * .25
    pattern.show()
    this.containerPatterns.add( pattern )
    this.patterns.push( pattern )

    pattern = this.patternsPool[ 2 ]
    pattern.position.x = 300
    pattern.rotation.y = Math.PI * .25
    pattern.show()
    this.containerPatterns.add( pattern )
    this.patterns.push( pattern )

    pattern = this.patternsPool[ 3 ]
    pattern.position.y = 300
    pattern.position.z = -100
    pattern.rotation.x = -Math.PI * .25
    pattern.show()
    this.containerPatterns.add( pattern )
    this.patterns.push( pattern )

    // pattern = this.patternsPool[ 4 ]
    // pattern.position.y = 200
    // pattern.rotation.x = -Math.PI * .5
    // pattern.show()
    // this.containerPatterns.add( pattern )
    // this.patterns.push( pattern )
    //
    pattern = this.patternsPool[ 4 ]
    pattern.position.y = -300
    pattern.rotation.x = Math.PI * .25
    pattern.show()
    this.containerPatterns.add( pattern )
    this.patterns.push( pattern )
  }

  createTunnel() {
    const data = [
      [ 0, 0, -50, 400 ],
      [ -200, -200, 400, 200 ],
      [ 200, 200, 400, 200 ],
      [ -400, 200, 2000, 400 ],
      [ 0, 0, 5000, 800 ],
    ]

    for( let i = 0, n = data.length; i < n; i++ ) {
      let dataCurr = data[ i ]

      let pattern = new Pattern( 0, 0, dataCurr[ 3 ], dataCurr[ 3 ] )
      pattern.position.x = dataCurr[ 0 ]
      pattern.position.y = dataCurr[ 1 ]
      pattern.position.z = dataCurr[ 2 ]
      pattern.disableShadows()
      this.containerPatterns.add( pattern )
    }
  }

  createCentered() {
    let pattern = new Pattern( 0, 0, 400, 400 )
    pattern.position.z = -50
    // pattern.disableShadows()
    this.containerPatterns.add( pattern )
    pattern.show()
    this.pattern = pattern
  }

  createSerie() {
    this.prepareSwitch()

    this.mode = "serie"

    this.patterns = []

    this.patternSerieCnt.position.x = 0
    this.patternSerieCnt.position.y = 0
    this.patternSerieCnt.position.z = 0
    this.containerPatterns.add( this.patternSerieCnt )

    this.createSeriePattern()
    timeout( this.firstSerieCreation, 1750 )
    timeout( this.lastSerieCreation, 3100 )
    timeout( this.serieMoveCamera, 3600 )
    timeout( this.separateSerie, 5000 )
    timeout( this.regenerateAllSerie, 4800 )
    timeout( this.regenerateAllSerie, 6000 )
    timeout( this.dezoomSerie, 6200 )
    timeout( this.rotateSerie, 7200 )
    timeout( this.rotateSerie2, 8200 )
    timeout( this.separateSerie2, 9000 )
    timeout( this.regenerateAllSerie, 9400 )
    timeout( this.prepareGlitchSwitch, 10700 )
    timeout( this.switchToSolo, 12000 )
  }

  createSeriePattern = () => {
    let idx = this.patterns.length

    stage3d.control.radius = stage3d.control._radius = 1200

    let pattern = this.patternsPool[ 0 ]
    pattern.position.x = 0
    pattern.position.y = 0
    pattern.position.z = -50
    this.patternSerieCnt.add( pattern )
    pattern.show()

    this.patterns.push( pattern )

    let newPosX = 0
    let newPosY = 0
    timeout( () => {
      TweenLite.to( this.patternSerieCnt.position, .4, {
        x: newPosX,
        y: newPosY,
        ease: Cubic.easeInOut
      } )
    }, 200 )
  }

  firstSerieCreation = () => {
    stage3d.control.radius = stage3d.control._radius = 1200
    TweenLite.to( stage3d.control, 6, {
      radius: 1700,
      ease: Cubic.easeOut
    } )

    let pattern = this.patternsPool[ 1 ]
    pattern.position.x = -400
    pattern.position.y = 0
    pattern.position.z = -50
    this.patternSerieCnt.add( pattern )
    pattern.show()

    this.patterns.push( pattern )

    timeout( () => {
      let pattern = this.patternsPool[ 2 ]
      pattern.position.x = 400
      pattern.position.y = 0
      pattern.position.z = -50
      this.patternSerieCnt.add( pattern )
      pattern.show()

      this.patterns.push( pattern )
    }, 300 )
  }

  lastSerieCreation = () => {
    let pattern = this.patternsPool[ 3 ]
    pattern.position.x = 0
    pattern.position.y = 400
    pattern.position.z = -50
    this.patternSerieCnt.add( pattern )
    pattern.show()

    this.patterns.push( pattern )

    timeout( () => {
      let pattern = this.patternsPool[ 4 ]
      pattern.position.x = -400
      pattern.position.y = 400
      pattern.position.z = -50
      this.patternSerieCnt.add( pattern )
      pattern.show()

      this.patterns.push( pattern )
    }, 200 )


    timeout( () => {
      let pattern = this.patternsPool[ 5 ]
      pattern.position.x = 400
      pattern.position.y = 400
      pattern.position.z = -50
      this.patternSerieCnt.add( pattern )
      pattern.show()

      this.patterns.push( pattern )
    }, 300 )
  }

  serieMoveCamera = () => {
    this.patternSerieCnt.position.x = 0
    this.patternSerieCnt.position.y = -200
  }

  separateSerie = () => {
    TweenLite.to( this.patterns[ 0 ].position, 1, {
      y: this.patterns[ 0 ].position.y - 20,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 1 ].position, 1, {
      x: this.patterns[ 1 ].position.x - 40,
      y: this.patterns[ 1 ].position.y - 20,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 2 ].position, 1, {
      x: this.patterns[ 2 ].position.x + 40,
      y: this.patterns[ 2 ].position.y - 20,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 3 ].position, 1, {
      y: this.patterns[ 3 ].position.y + 20,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 4 ].position, 1, {
      x: this.patterns[ 4 ].position.x - 40,
      y: this.patterns[ 4 ].position.y + 20,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 5 ].position, 1, {
      x: this.patterns[ 5 ].position.x + 40,
      y: this.patterns[ 5 ].position.y + 20,
      ease: Cubic.easeInOut
    })
  }

  regenerateAllSerie = () => {
    for( let i = 0, n = this.patterns.length; i < n; i++ ) {
      let pattern = this.patterns[ i ]
      pattern.regenerate()
    }
  }

  dezoomSerie = () => {
    TweenLite.killTweensOf( stage3d.control )
    stage3d.control.radius = stage3d.control._radius = 1870
    TweenLite.to( stage3d.control, 1.2, {
      radius: 2000,
      ease: Quad.easeOut
    } )
  }

  rotateSerie = () => {
    this.containerPatterns.rotation.z = Math.PI * .5 * .6
    TweenLite.to( this.containerPatterns.rotation, .8, {
      z: Math.PI * .5,
      ease: Cubic.easeInOut
    } )

    for( let i = 0, n = this.patterns.length; i < n; i++ ) {
      this.patterns[ i ].flip2( .15 + Math.random() * .4 )
    }
  }

  rotateSerie2 = () => {
    this.regenerateAllSerie()

    this.containerPatterns.rotation.z = Math.PI * .7
    TweenLite.to( this.containerPatterns.rotation, .8, {
      z: Math.PI,
      ease: Cubic.easeInOut
    } )

    for( let i = 0, n = this.patterns.length; i < n; i++ ) {
      this.patterns[ i ].flip2( .15 + Math.random() * .4 )
    }
  }

  separateSerie2 = () => {
    TweenLite.to( this.patterns[ 0 ].position, 1, {
      y: this.patterns[ 0 ].position.y - 60,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 1 ].position, 1, {
      x: this.patterns[ 1 ].position.x - 120,
      y: this.patterns[ 1 ].position.y - 60,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 2 ].position, 1, {
      x: this.patterns[ 2 ].position.x + 120,
      y: this.patterns[ 2 ].position.y - 60,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 3 ].position, 1, {
      y: this.patterns[ 3 ].position.y + 60,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 4 ].position, 1, {
      x: this.patterns[ 4 ].position.x - 120,
      y: this.patterns[ 4 ].position.y + 60,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 5 ].position, 1, {
      x: this.patterns[ 5 ].position.x + 120,
      y: this.patterns[ 5 ].position.y + 60,
      ease: Cubic.easeInOut
    })
  }

  prepareSwitch() {
    this.spotLight.position.z = 320
    this.spotLight.intensity = .45

    for( let i = 0, n = this.patternsPool.length; i < n; i++ ) {
      let p = this.patternsPool[ i ]
      p.position.set( 0, 0, 0 )
      p.rotation.set( 0, 0, 0 )
      if( p.parent ) {
        p.parent.remove( p )
      }
    }

    this.containerPatterns.position.set( 0, 0, 0 )
    this.containerPatterns.rotation.set( 0, 0, 0 )
    while( this.containerPatterns.children.length ) {
      let c = this.containerPatterns.children.splice( 0, 1 )
      this.containerPatterns.remove( c )
    }
  }

  prepareGlitchSwitch = () => {
    this.mode = "switch"
    this.postProcess.params.glitchOffsetX = 2 + 5 * Math.random() >> 0
    this.postProcess.params.glitchOffsetY = 2 + 5 * Math.random() >> 0
  }

  switchToSolo = () => {
    this.prepareSwitch()

    this.mode = "solo"

    stage3d.control.radius = stage3d.control._radius = 1200
    TweenLite.to( stage3d.control, 1, {
      radius: 900,
      ease: Cubic.easeOut
    } )

    this.patterns = []

    let pattern = this.patternsPool[ 0 ]
    pattern.position.x = 0
    pattern.position.y = 0
    this.containerPatterns.add( pattern )
    pattern.flip()
    this.patterns.push( pattern )

    this.sceneHUE = 320
    this.updateSceneColor()

    this.postProcess.params.glitchRatio = .25
    this.postProcess.params.glitchOffsetX = 2
    this.postProcess.params.glitchOffsetY = 2

    timeout( () => {
      pattern.zStopToRefresh = 1
      pattern.regenerate()
    }, 400 )

    // this.autoRefresh()
  }

  autoRefresh = () => {
    timeout( () => {
      let pattern = this.patterns[ 0 ]
      if( Math.random() < .1 ) {
        pattern.zStopToRefresh = 0
      } else {
        pattern.zStopToRefresh = 1 + Math.random() * 3 >> 0
      }
      pattern.regenerate()

      // if( Math.random() < .5 ) {
      //   pattern.flip()
      // }
      this.autoRefresh()
    }, Math.random() * 1500 + 500 )
  }

  ///

  onBeat = () => {
    console.log( "beat" )
    if( Math.random() < .5 ) {
      for( let i = 0, n = this.patterns.length; i < n; i++ ) {
        this.patterns[ i ].flip()
      }
    }

    if( this.isColorRefreshingByVolume ) {
      this.sceneHUE += Math.random() * 60
      this.updateSceneColor()
    }
  }

  onUpdate = () => {
    if( audio.volume > this.volumeMax * .927  ) {
      this.refreshByVolume()
    }

    if( Math.random() < .00325 ) {
      this.refreshByVolume()
    }
    if( Math.random() < .00325 ) {
      this.updateSceneColor()
    }
    if( Math.random() < .0045 ) {
      for( let i = 0, n = this.patterns.length; i < n; i++ ) {
        this.patterns[ i ].flip()
      }
    }

    if( audio.time > 6000 && this.stepScenar == 0 ) {
      this.onKeyboardDown( 80 )
      this.stepScenar++
    } else if ( audio.time > 15800 && this.stepScenar == 1 ) {
      this.onKeyboardDown( 50 )
      this.stepScenar++
    } else if ( audio.time > 24000 && this.stepScenar == 2 ) {
      this.onKeyboardDown( 81 )
      this.stepScenar++
    } else if ( audio.time > 29000 && this.stepScenar == 3 ) {
      this.onKeyboardDown( 49 )
      this.stepScenar++
    } else if ( audio.time > 34000 && this.stepScenar == 4 ) {
      this.onKeyboardDown( 81 )
      this.stepScenar++
    } else if ( audio.time > 38000 && this.stepScenar == 5 ) {
      this.onKeyboardDown( 51 )
      this.stepScenar++
    } else if ( audio.time > 43000 && this.stepScenar == 6 ) {
      this.onKeyboardDown( 55 )
      this.stepScenar++
    } else if ( audio.time > 48000 && this.stepScenar == 7 ) {
      this.onKeyboardDown( 53 )
      this.stepScenar++
    } else if ( audio.time > 55000 && this.stepScenar == 8 ) {
      this.onKeyboardDown( 54 )
      this.stepScenar++
    } else if ( audio.time > 62000 && this.stepScenar == 9 ) {
      this.onKeyboardDown( 55 )
      this.stepScenar++
    } else if ( audio.time > 67000 && this.stepScenar == 10 ) {
      this.onKeyboardDown( 49 )
      this.onKeyboardDown( 81 )
      this.onKeyboardDown( 57 )
      this.stepScenar++
    } else if ( audio.time > 68000 && this.stepScenar == 11 ) {
      this.onKeyboardDown( 32 )
      this.stepScenar++
    } else if ( audio.time > 69000 && this.stepScenar == 12 ) {
      this.onKeyboardDown( 77 )
      this.stepScenar++
    } else if ( audio.time > 71000 && this.stepScenar == 13 ) {
      this.onKeyboardDown( 13 )
      this.stepScenar++
    } else if ( audio.time > 73000 && this.stepScenar == 14 ) {
      this.onKeyboardDown( 77 )
      this.stepScenar++
    }  else if ( audio.time > 78000 && this.stepScenar == 15 ) {
      this.onKeyboardDown( 80 )
      this.stepScenar++
    } else if ( audio.time > 84000 && this.stepScenar == 16 ) {
      this.onKeyboardDown( 55 )
      this.onKeyboardDown( 54 )
      this.stepScenar++
    } else if ( audio.time > 90000 && this.stepScenar == 17 ) {
      this.onKeyboardDown( 49 )
      this.onKeyboardDown( 50 )
      this.stepScenar++
    } else if ( audio.time > 92500 && this.stepScenar == 18 ) {
      this.onKeyboardDown( 81 )
      this.stepScenar++
    } else if ( audio.time > 94000 && this.stepScenar == 19 ) {
      this.onKeyboardDown( 77 )
      this.stepScenar++
    } else if ( audio.time > 95500 && this.stepScenar == 20 ) {
      this.onKeyboardDown( 79 )
      this.stepScenar++
    } else if ( audio.time > 100000 && this.stepScenar == 21 ) {
      this.onKeyboardDown( 51 )
      this.stepScenar++
    } else if ( audio.time > 105000 && this.stepScenar == 22 ) {
      this.onKeyboardDown( 54 )
      this.stepScenar++
    } else if ( audio.time > 112000 && this.stepScenar == 23 ) {
      this.onKeyboardDown( 49 )
      this.onKeyboardDown( 51 )
      this.stepScenar++
    } else if ( audio.time > 120000 && this.stepScenar == 24 ) {
      this.onKeyboardDown( 71 )
      this.stepScenar++
    } else if ( audio.time > 125000 && this.stepScenar == 25 ) {
      this.onKeyboardDown( 48 )
      this.stepScenar++
    } else if ( audio.time > 131800 && this.stepScenar == 26 ) {
      this.onKeyboardDown( 49 )
      this.stepScenar++
    } else if ( audio.time > 150000 && this.stepScenar == 27 ) {
      this.onKeyboardDown( 51 )
      this.stepScenar++
    } else if ( audio.time > 170000 && this.stepScenar == 28 ) {
      this.onKeyboardDown( 49 )
      this.stepScenar++
    } else if ( audio.time > 171000 && this.stepScenar == 29 ) {
      this.onKeyboardDown( 81 )
      this.stepScenar++
    } else if ( audio.time > 172000 && this.stepScenar == 30 ) {
      this.onKeyboardDown( 81 )
      this.stepScenar++
    } else if ( audio.time > 173000 && this.stepScenar == 31 ) {
      this.onKeyboardDown( 81 )
      this.onKeyboardDown( 55 )
      this.stepScenar++
    } else if ( audio.time > 180000 && this.stepScenar == 32 ) {
      this.onKeyboardDown( 81 )
      this.onKeyboardDown( 49 )
      this.stepScenar++
    } else if ( audio.time > 182000 && this.stepScenar == 33 ) {
      this.onKeyboardDown( 81 )
      this.stepScenar++
    } else if ( audio.time > 186000 && this.stepScenar == 34 ) {
      this.onKeyboardDown( 53 )
      this.stepScenar++
    } else if ( audio.time > 190000 && this.stepScenar == 35 ) {
      this.onKeyboardDown( 54 )
      this.stepScenar++
    } else if ( audio.time > 193000 && this.stepScenar == 36 ) {
      this.onKeyboardDown( 53 )
      this.stepScenar++
    } else if ( audio.time > 195000 && this.stepScenar == 37 ) {
      this.onKeyboardDown( 54 )
      this.stepScenar++
    } else if ( audio.time > 197000 && this.stepScenar == 38 ) {
      this.onKeyboardDown( 49 )
      this.stepScenar++
    } else if ( audio.time > 200000 && this.stepScenar == 38 ) {
      this.onKeyboardDown( 73 )
      this.stepScenar++
    } else if( audio.time > 205000 && this.stepScenar == 39 ) {
      this.onKeyboardDown( 49 )
      this.onKeyboardDown( 81 )
      this.onKeyboardDown( 54 )
      this.stepScenar++
    } else if( audio.time > 211000 && this.stepScenar == 40 ) {
      this.postProcess.toEnd()
      timeout( this.end, 4000 )
      this.stepScenar++
    }

    if( this.mode == "five" && audio.volume > this.volumeMax * .9 && this.fiveRadius ) {
      stage3d.control.radius = stage3d.control._radius = this.fiveRadius[ this.fiveRadius.length * Math.random() >> 0 ]
    }

    let ratioBase = 0
    if( this.mode == "solo" || this.mode == "five" ) {
      ratioBase = .25
    } else if ( this.mode == "custom" ) {
      ratioBase = this.glitchRatio
    } else if ( this.mode == "switch" ) {
      ratioBase = 4
    } else {
      ratioBase = .05
    }
    this.postProcess.params.glitchRatio = ratioBase * audio.volume / this.volumeMax

    this.zStep = 1 + 60 * ( audio.volume / this.volumeMax )
    this.refreshZStep()
  }

  refreshByVolume() {
    if( !this.canRefreshByVolume ) {
      return
    }

    this.refreshPatterns()
  }

  refreshPatterns() {
    for( let i = 0, n = this.patterns.length; i < n; i++ ) {
      let pattern = this.patterns[ i ]
      if( Math.random() < .1 ) {
        pattern.zStopToRefresh = 0
      } else {
        pattern.zStopToRefresh = 1 + Math.random() * 3 >> 0
      }
      pattern.regenerate()
    }
  }

  refreshZStep() {
    for( let i = 0, n = this.patterns.length; i < n; i++ ) {
      let p = this.patterns[ i ]
      p.zStep = this.zStep
      p.refreshZStep()
    }
  }

  end = () => {
    console.log( "END" )
  }

}

module.exports = DD
