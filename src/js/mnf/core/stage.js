const Signals = require( "mnf/events/Signals" )
const date = require( "mnf/utils/date" )
const timeout = require( "mnf/utils/timeout" )

class Stage {

	constructor( andInit = true ) {
		this.skipLimit = 32
		this.skipActivated  = true
		this.lastTime = date.now();
		this.pause = false

		this.tiId = -1

		this.width = 0;
		this.height = 0;

		this.pixelRatio = window.devicePixelRatio

		this.onResize = new Signals()
		this.onUpdate = new Signals()

		if( andInit ) {
			this.init()
		}
	}

	init( andDispatch = true ) {
		window.addEventListener( "resize", this.onResizeWithDelay, false )
		window.addEventListener( "orientationchange", this.onResizeWithDelay, false )

		if( andDispatch ) {
			this.onResizeWithoutDelay()
		}
		requestAnimationFrame( this.update )
	}

	onResizeWithDelay = () => {
		if( this.tiId ) {
			timeout.clear( this.tiId )
		}
		timeout( this.onResizeWithoutDelay, 10 )
	}

	onResizeWithoutDelay = () => {
		this.width = window.innerWidth
		this.height = window.innerHeight

		this.onResize.dispatch()
	}

	forceResize( withDelay = false ) {
		if( withDelay ) {
			this.onResizeWithDelay()
			return
		}
		this.onResizeWithoutDelay()
	}

	update = () => {
		let t = date.now()
		let dt = t - this.lastTime
		this.lastTime = t
		requestAnimationFrame( this.update )

		if( (this.skipActivated && dt > this.skipLimit) || this.pause){
			return
		}

		this.onUpdate.dispatch( dt )
	}

}

module.exports = new Stage()
