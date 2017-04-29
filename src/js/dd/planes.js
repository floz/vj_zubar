const stage3d = require( "mnf/core/stage3d" )

const PlaneData = require( "planes/PlanesData" )
const data = new PlaneData( 128, 128, { autoFill: false } )

const PlanesMaterial = require( "planes/PlanesMaterial" )
const material = new PlanesMaterial( {
  size: 1,
  isFacingCamera: false,
  simulations: null
} )

const Planes = require( "planes/Planes" )
const planes = new Planes( data, { material: material } )
stage3d.add( planes )

module.exports = planes
