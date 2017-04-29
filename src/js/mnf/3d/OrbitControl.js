const stage 				= require( "mnf/core/stage" )
const interactions 	= require( "mnf/core/interactions" )
const wheel 				= require( "mnf/utils/wheel" )

class OrbitControl {

	constructor( camera, target=null, radius=100 ) {
	this.camera = camera
	this.target = target || new THREE.Vector3()
	this.targetBase = target || new THREE.Vector3()
	this._radius = this.radius = radius || this.camera.position.distanceTo( this.target ) || 1

	this._domEvents = document.getElementById( "three" )

	this._isDown = false
	this._isActive = true

	this.offset = new THREE.Vector3()

	//Freeze camera
	this._isFreeze = false;
	this.cameraAddPosition = new THREE.Vector3(0,0,0);

	this.speedMouse = 1
	this.speedMax = 1

	this.targetX = 0
	this.followTargetX = false
	this.followTargetY = false

	this.friction = .968
	this.frictionVx = .0008
	this.frictionVy = .0006

	this.bouncing = true

	this._posCurr = new THREE.Vector2()
	this._posLast = new THREE.Vector2()
	this._vx = 0
	this._vy = 0
	this._phi = Math.PI * .5
	this._theta = Math.PI * .5

	this.isPhiRestricted = false
	this.minPhi = Math.PI / 8
	this.maxPhi = 1.7
	this.noZoom = false

	this.minRadius = 0
	this.maxRadius = Number.MAX_VALUE

	this.activate()
	this.update()
	this.camera.updateMatrixWorld()
	}

	_onDown = ( e )=>{
		this._isDown = true
		this._posCurr.set( e.x, e.y )
		this._posLast.set( e.x, e.y )
		interactions.onUp.add( this._onUp )
	}

	_onUp = ()=>{
		this._isDown = false
		interactions.onUp.remove( this._onUp )
	}

	_onMove = ( e )=> {
		if( this._isDown ) {
			this._posLast.copy( this._posCurr )
			this._posCurr.set( e.x, e.y )

			const diffX = ( this._posCurr.x - this._posLast.x ) * this.speedMouse
			const diffY = ( this._posCurr.y - this._posLast.y ) * this.speedMouse

			this._vx -= diffX * this.frictionVx
			this._vy += diffY * this.frictionVy
		}

		const swh = stage.width >> 1
		const shh = stage.height >> 1

		const dx = swh - e.x
		const dy = shh - e.y

		let xAdd = dx / swh
		let yAdd = dy / shh
	}

	get isActive(){
		return this._isActive
	}

	set isActive(value){
		this._isActive = value
		if(value){
			this.activate()
		} else{
			this.deactivate()
		}
	}

	onWheel = ( e )=>{
		if( this.noZoom ) return;
		if( e.delta < 0 ) this.zoomOut();
		else this.zoomIn()
	}

	zoomIn = ()=>{
		this.radius *= .98
		if(this.radius<this.minRadius){
			this.radius = this.minRadius
		}
	}

	zoomOut = ()=>{
		this.radius *= 1.05
		if(this.radius>this.maxRadius){
			this.radius = this.maxRadius
		}
	}


	update = ()=>{
		this._vx = Math.max( -this.speedMax, Math.min( this._vx, this.speedMax ) )
		this._vy = Math.max( -this.speedMax, Math.min( this._vy, this.speedMax ) )

		this._radius += (this.radius-this._radius)*0.25
		this._vx *= this.friction
		this._vy *= this.friction

		if( this.followTargetY ) {
			this._phi += ( Math.PI * .5 - this._phi ) * .005
		} else {
			this._phi -= this._vy
		}

		if( this.followTargetX ) {
			this._theta += ( this.targetX - this._theta ) * .09
		} else {
			this._theta -= this._vx
		}

		this._phi %= Math.PI * 2
		if( this._phi < 0 ) {
			this._phi += Math.PI * 2
		}
		this._theta %= Math.PI * 2
		if( this._theta < 0 ) {
			this._theta += Math.PI * 2
		}

		if( this.isPhiRestricted ) {
			const targetPhi = Math.max( this.minPhi, Math.min( this.maxPhi, this._phi ) )
			this._phi += ( targetPhi-this._phi ) * .15
		}

		this.camera.position.x = this.offset.x + this.target.x + this._radius * Math.sin( this._phi ) * Math.cos( this._theta )
		this.camera.position.y = this.offset.y + this.target.y + this._radius * Math.cos( this._phi )
		this.camera.position.z = this.offset.z + this.target.z + this._radius * Math.sin( this._phi ) * Math.sin( this._theta )

		this.camera.lookAt( new THREE.Vector3(this.target.x+this.offset.x,this.target.y+this.offset.y,this.target.z+this.offset.z ) )
	}

	activate() {
		interactions.onDown.add( this._onDown )
		interactions.onMove.add( this._onMove )
		wheel.add( this.onWheel )
	}

	deactivate() {
		interactions.onDown.remove( this._onDown )
		interactions.onMove.remove( this._onMove )
		wheel.remove( this.onWheel )
	}

}

module.exports = OrbitControl
