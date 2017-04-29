//
// Provide easy way to connect to the midi controler
// author : David Ronai / Makio64 / makiopolis.com
//

const Signal = require('mnf/events/Signals')
const MidiController = require('./MidiController')
const LaunchControlXL = require('./LaunchControlXL')
const LaunchpadMK2 = require('./LaunchpadMK2')
const PaletteGear = require('./PaletteGear')

const onInit = module.exports.onInit = new Signal()
const midis = []
let xl = null
let pad = null
let palette = null


module.exports.init = ( { debug = false, hasFallback = false } = {} )=>{
	module.exports.debug = debug
	if( navigator.requestMIDIAccess ) {
		navigator.requestMIDIAccess( { sysex: false } )
						 .then( ( midiAccess ) => {

				let midi = midiAccess
				let inputs = []
				let outputs = []

				console.log('[MIDI] INIT:',midi.inputs.size)
				if( midi.inputs.size == 0 ) {
					console.warn( "No Midi inputs detected, dummy used instead!" )

					if( hasFallback ) {
						module.exports.pad = new MidiController()
						module.exports.xl = new MidiController()
						module.exports.pg = new MidiController()

						onInit.dispatch()
					}
					return
				}

				midi.inputs.forEach( ( device, key )=>{
						inputs.push(device)
				})
				midi.outputs.forEach( ( device, key )=>{
						outputs.push(device)
				})

				for(let i = 0; i < inputs.length; i++){
					let m = null
					if(inputs[i].name == "Launchpad MK2"){
						m = new LaunchpadMK2(inputs[i], outputs[i])
						module.exports.pad = m
					} else if(inputs[i].name == "Launch Control XL") {
						m = new LaunchControlXL(inputs[i],outputs[i])
						module.exports.xl = m
					} else if( inputs[ i ].name == "USB MIDI Device" ) {
						m = new PaletteGear( inputs[ i ], outputs[ i ] )
						module.exports.pg = m
					} else {
						console.warn( "Input detected but not recognized:", inputs[i].name )
					}
					if( m ) {
						midis.push(m)
						m.debug = module.exports.debug
					}
				}
				onInit.dispatch()
			}
			, (error)=>{
				console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error)
			})
	}
	else{
		alert("No MIDI support in your browser.")
	}
}
