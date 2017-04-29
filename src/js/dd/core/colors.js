let colorAmbient = null
let colorSpotlight = null
let colorFog = null


let idxColor = 0
const colorsSet = [ new THREE.Color( 0x367157 ), new THREE.Color( 0x367157 ), new THREE.Color( 0xaaaaaa ), new THREE.Color( 0xbd1616 ) ]
const colorsSecondary = [ new THREE.Color( 0xfd4656 ), new THREE.Color( 0xffffff ), new THREE.Color( 0xfd4656 ), new THREE.Color( 0xaaaaaa ) ]

let colorMain = colorsSet[ 0 ]
let colorSecondary = colorsSecondary[ 0 ]

let HUEMain = colorsSet[ 0 ].getHSL().h * 360
let HUESecondary = ( HUEMain - 180 ) % 360

module.exports.set = ( value ) => {
  HUEMain = value % 360
  HUESecondary = ( value - 180 ) % 360

  let hue = HUEMain / 360
  let sat = 1
  let lum = .5
  colorAmbient = new THREE.Color().setHSL( hue, sat, lum )

  hue = HUEMain / 360
  sat = .5
  lum = .2
  colorSpotlight = new THREE.Color().setHSL( hue, sat, lum )

  hue = HUEMain / 360
  sat = .5
  lum = .25
  colorFog = new THREE.Color().setHSL( hue, sat, lum )
}

module.exports.get = () => {
  let hue = 0
  let sat = 1
  if( Math.random() > .1 ) {
    hue = ( ( HUEMain + Math.random() * 40 - 20 ) % 360 ) / 360
    sat = .6
  } else {
    hue = ( ( HUESecondary + Math.random() * 40 - 20 ) % 360 ) / 360
    sat = .9
  }
  const lum = .2 + Math.random() * .5
  return new THREE.Color().setHSL( hue, sat, lum )
}

module.exports.getAmbient = () => {
  return colorAmbient
}

module.exports.getSpotLight = () => {
  return colorSpotlight
}

module.exports.getFog = () => {
  return colorFog
}
