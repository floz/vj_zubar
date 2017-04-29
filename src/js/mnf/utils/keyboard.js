const Signals = require( 'mnf/events/Signals' );

const special = {
	metaKey : false, // apple/command
	shiftKey : false,
	altKey : false,
	ctrlKey : false
}

const down = new Signals()
const up = new Signals()

window.addEventListener('keydown', (e)=>{
	special.metaKey = e.metaKey
	special.shiftKey = e.shiftKey
	special.altKey = e.altKey
	special.ctrlKey = e.ctrlKey
	down.dispatch(e.which, e)
})

window.addEventListener('keyup', (e)=>{
	special.metaKey = e.metaKey
	special.shiftKey = e.shiftKey
	special.altKey = e.altKey
	special.ctrlKey = e.ctrlKey
	up.dispatch(e.which, e)
})

module.exports.special = special
module.exports.up = module.exports.onUp = up
module.exports.down = module.exports.onDown = down

module.exports.touches = {
	"space": 32,
	"q": 81,
	"w": 87,
 	"e": 69,
	"r": 82,
	"t": 84,
	"y": 89,
	"u": 85,
	"i": 73,
	"o": 79,
	"p": 80,
	"a": 65,
	"s": 83,
	"d": 68,
	"f": 70,
	"g": 71,
	"h": 72,
	"j": 74,
	"k": 75,
	"l": 76,
	"z": 90,
	"x": 88,
	"c": 67,
	"v": 86,
	"b": 66,
	"n": 78,
	"m": 77,
	"1": 49,
	"2": 50,
	"3": 51,
	"4": 52,
	"5": 53,
	"6": 54,
	"7": 55,
	"8": 56,
	"9": 57,
	"0": 48,
	"[": 219,
	"]": 221,
	"\\": 220,
	";": 186,
	"'": 222,
	",": 188,
	".": 190,
	"/": 191
}
