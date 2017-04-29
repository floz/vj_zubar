const stage = require( "mnf/core/stage" )
const Signals = require( "mnf/events/Signals" )
const browsers = require( "mnf/utils/browsers" )

var downs = {};
var moves = {};
var ups = {};
var clicks = {};
var overs = {};
var outs = {};

var interactionsEvents = [ downs, moves, ups, clicks ];

var isTouchDevice = browsers.mobile || browsers.tablet

function getEvent( action ) {
	var evt = "";
	if( isTouchDevice ) {

		if (window.navigator.msPointerEnabled) {
			switch( action ) {
				case "down": evt = "MSPointerDown"; break;
				case "move": evt = "MSPointerMove"; break;
				case "up": evt = "MSPointerUp"; break;
				case "click": evt = "MSPointerUp"; break;
			}

			//console.log("evt", evt, action);

		} else {
			switch( action ) {
				case "down": evt = "touchstart"; break;
				case "move": evt = "touchmove"; break;
				case "up": evt = "touchend"; break;
				case "click": evt = "touchstart"; break;
			}
		}

	} else {
		switch( action ) {
			case "down": evt = "mousedown"; break;
			case "move": evt = "mousemove"; break;
			case "up": evt = "mouseup"; break;
			case "click": evt = "click"; break;
			case "over": evt = browsers.safari ? "mouseover" : "mouseenter"; break;
			case "out": evt = browsers.safari ? "mouseout" : "mouseleave"; break;
		}
	}
	return evt;
}

function getObj( action ) {
	switch( action ) {
		case "down": return downs;
		case "move": return moves;
		case "up": return ups;
		case "click": return clicks;
		case "over": return overs;
		case "out": return outs;
	}
}

function find( cb, datas ) {
	var data = null;
	for( var i = 0, n = datas.length; i < n; i++ ) {
		data = datas[ i ];
		if( data.cb == cb ) {
			return { data: data, idx: i };
		}
	}
	return null;
}

const on =
module.exports.on = function( elt, action, cb ) {
	var evt = getEvent( action );
	if( evt == "" ){
		return;
	}

	var obj = getObj( action );
	if( !obj[ elt ] ) {
		obj[ elt ] = [];
	}

	var isOver = false;

	function proxy( e ) {
		e = { x: 0, y: 0, origin: e };

		if( isTouchDevice ) {
			if (window.navigator.msPointerEnabled) {
					// mspointerevents
					e.x = e.origin.clientX;
					e.y = e.origin.clientY;

			} else {
				var touch = e.origin.touches[ 0 ];
				if( touch ) {
					e.x = touch.clientX;
					e.y = touch.clientY;
				}
			}

		} else {
			e.x = e.origin.clientX;
			e.y = e.origin.clientY;
		}

		cb.call( this, e );
	}

	obj[ elt ].push( { cb: cb, proxy: proxy } );
	elt.addEventListener( evt, proxy, false );
}

const off =
module.exports.off = function( elt, action, cb ) {
	var evt = getEvent( action );
	if( evt == "" ) {
		return;
	}

	var obj = getObj( action );
	if( !obj[ elt ] ) {
		return;
	}

	var datas = obj[ elt ];
	if( cb ) {
		var result = find( cb, datas );
		if( !result ) {
			return;
		}
		elt.removeEventListener( evt, result.data.proxy, false );
		obj[ elt ].splice( result.idx, 1 );
	} else {
		var data = null;
		for( var i = 0, n = datas.length; i < n; i++ ) {
			data = datas[ i ];
			elt.removeEventListener( evt, data.proxy, false );
		}
		obj[ elt ] = null;
		delete obj[ elt ];
	}
}

const has =
module.exports.has = function( elt, action, cb ) {
	var evt = getEvent( action );
	if( evt == "" ) {
		return;
	}

	var obj = getObj( action );
	if( !obj[ elt ] ) {
		return;
	}

	var datas = obj[ elt ];
	if( cb ) {
		return true;
	}
	return false;
}

module.exports.unbind = function( elt ) {
	for( var i = 0, n = interactionsEvents.length; i < n; i++ ) {
		interactionsEvents[ i ][ elt ] = null;
		delete interactionsEvents[ i ][ elt ];
	}
}

// Fonctionnalités présentes dans @Makio64 Interactions.js

const config = module.exports.config =  {}
const infos = module.exports.infos = { isMouseDown: false }

const mouse =
module.exports.mouse = {
	x: stage.width *.5,
	y: stage.height *.5,
	normalizedX: 0.5,
	normalizedY: 0.5,
	unitX: 0.0,
	unitY: 0.0,
	moveX: 0,
	moveY: 0,
	e: null
}

const prevMouse =
module.exports.prevMouse = {
	x: stage.width *.5,
	y: stage.height *.5
}

const move =
module.exports.move = {
	x: stage.width *.5,
	y: stage.height *.5
}

const onDown =
module.exports.onDown = new Signals()
const onUp =
module.exports.onUp = new Signals()
const onMove =
module.exports.onMove = new Signals()
const onClick =
module.exports.onClick = new Signals()
const onLeave =
module.exports.onLeave = new Signals()

function getMouseValue( e ) {
	const tmpX = mouse.x
	const tmpY = mouse.y
	mouse.x = e.x
	mouse.y = e.y
	move.x = mouse.x - tmpX
	move.y = mouse.y - tmpY
	mouse.moveX = move.x
	mouse.moveY = move.y
	mouse.normalizedX = mouse.x / stage.width
	mouse.normalizedY = mouse.y / stage.height
	mouse.unitX = ( mouse.normalizedX - 0.5 ) * 2
	mouse.unitY = ( mouse.normalizedY - 0.5 ) * 2
	mouse.origin = e.origin
	return mouse
}

function updatePrevMouse( e ) {
	prevMouse.x = mouse.x
	prevMouse.y = mouse.y
}

on( window, "down", ( e ) => {
	infos.isMouseDown = true
	onDown.dispatch( getMouseValue( e ) )
} )

on( window, "move", ( e ) => {
	updatePrevMouse()
	onMove.dispatch( getMouseValue( e ) )
})

on( window, "up", ( e ) => {
	infos.isMouseDown = false
	onUp.dispatch( getMouseValue( e ) )
})

on( window, "click", ( e ) => {
	onClick.dispatch( getMouseValue( e ) )
})

// Window other events

function onLeaveHandler() {
	onLeave.dispatch()
	infos.mouseIsDown = false
}

window.addEventListener('blur', (e)=>{
	onLeaveHandler()
},)

window.addEventListener('mouseleave', (e)=>{
	onLeaveHandler()
},)
