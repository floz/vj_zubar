const Signals = require('mnf/events/Signals')

const signal = new Signals()
const options = module.exports.options = {noDefaultWheel:false, single:false}

let isStop = 0
let lastTime = 0

const getDelta = function(e){
	let  o = {
		direction : ((e.deltaY && e.deltaY<0) || e.detail < 0 || e.wheelDelta > 0) ? 1 : -1,
		delta: e.detail || e.wheelDelta || e.deltaY,
		original:e
	}
	if(o.delta == 0 && e.deltaY==0){
		o.direction = 0
	}
	return o
}

const support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
							document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
							"DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

window.addEventListener( support, (e)=> {
	if ( options.noDefaultWheel ){
		e.preventDefault()
	}

	let d = getDelta(e)

	if(options.single && Date.now()-lastTime<100){
		lastTime = Date.now()
		if(d.delta == 0 && isStop!=0){
			isStop = 0
			return
		}
		else if( isStop == 0 ){
			isStop = d.direction
		}
		else if( d.direction != isStop ){
			isStop = d.direction
		}
		else {
			return
		}
	}
	lastTime = Date.now()
	signal.dispatch(d)
})

module.exports = signal
