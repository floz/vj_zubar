const ObjectPool = require( "mnf/utils/ObjectPool" )

const CircleElement = require( "./CircleElement" )
const SquareElement = require( "./SquareElement" )
const TriangleElement = require( "./TriangleElement" )

class ElementPools {

  constructor() {
    this.circle = new ObjectPool( () => { return new CircleElement() }, 500 )
    this.square = new ObjectPool( () => { return new SquareElement() }, 500 )
    this.triangle = new ObjectPool( () => { return new TriangleElement() }, 500 )
  }

}

module.exports = new ElementPools()
