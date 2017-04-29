//
// Provide easy way to connect to the midi controler
// author : David Ronai / Makio64 / makiopolis.com
//

const Signal = require('mnf/events/Signals')
const MidiController = require('./MidiController')

class LaunchControlXL extends MidiController{

	constructor(input,output){
		super()
		this.input = input
		this.input.onmidimessage = this.onMIDIMessage
		this.output = output
		this.debug = false
		this.onMessage = new Signal()
	}

	onMIDIMessage=(message)=>{
		const data = message.data
		const cmd = data[0] >> 4
		const channel = data[0] & 0xf
		const type = data[0] & 0xf0
		const note = data[1]
		const velocity = data[2]/127
		const id = message.target.id
		if(this.debug){
				console.log("NOTE:",note)
		}
		this.onMessage.dispatch({midi:this,data:data,cmd:cmd,channel:channel,type:type,note:note,velocity:velocity})
	}

	sendMessage=(note,value)=>{
		if(note >= 41){
			this.output.send( [144,note,value] )
		}
		else{
			this.output.send( [240, 0, 32, 41, 2, 17, 120, 0, note, value, 247] )
		}
	}

	allButton=(value)=>{
		for( let i = 0; i < 4; i++){
			this.sendMessage(41+i, value)
			this.sendMessage(73+i, value)
			this.sendMessage(57+i, value)
			this.sendMessage(89+i, value)
		}
	}
	allGreen=()=>{this.allButton(60)}
	allRed=()=>{this.allButton(15)}
	allYellow=()=>{this.allButton(62)}
	allAmber=()=>{this.allButton(29)}
	allOff=()=>{this.allButton(12)}

	greenLed=(note)=>{this.sendMessage(note,60)}
	redLed=(note)=>{this.sendMessage(note,15)}
	yellowLed = (note)=> {this.sendMessage(note,62)}
	amberLed = (note) => {this.sendMessage(note,29)}
	offLed=(note)=>{this.sendMessage(note,12)}
}

module.exports = LaunchControlXL
