//
// Provide easy way to connect to the midi controler
// author : David Ronai / Makio64 / makiopolis.com
//

const Signal = require('mnf/events/Signals')
const MidiController = require('./MidiController')

class LaunchpadMK2 extends MidiController{

	constructor(input,output){
		super()
		this.input = input
		this.input.onmidimessage = this.onMIDIMessage
		this.output = output
		this.debug = false
		this.onMessage = new Signal()
	}

	onMIDIMessage=(message)=>{
		data = message.data
		cmd = data[0] >> 4
		channel = data[0] & 0xf
		type = data[0] & 0xf0
		note = data[1]
		velocity = data[2]/127
		id = message.target.id
		if(this.debug){
			console.log("NOTE:",note)
		}
		this.onMessage.dispatch({midi:this,data:data,cmd:cmd,channel:channel,type:type,note:note,velocity:velocity})
	}

	sendMessage=(note,value)=>{
		this.output.send( [144,note,value] )
	}

	displayMessage(grid){
		for(let x = 0; x<8; x++){
			for(let y=0; y<8; y++){
				this.sendMessage((x+1)+(7-y+1)*10, grid[y][x])
			}
		}
	}

	displayTimer(){
		this.allRed()
		setTimeout(()=>{
		this.displayMessage([
			[3,3,3,3,3,3,3,3],
			[3,3,6,6,6,6,3,3],
			[3,3,3,3,3,6,3,3],
			[3,3,3,6,6,6,3,3],
			[3,3,3,3,3,6,3,3],
			[3,3,3,3,3,6,3,3],
			[3,3,6,6,6,6,3,3],
			[3,3,3,3,3,3,3,3],
		])},1000)
		setTimeout(()=>{
				this.allRed()
		},1950)
		setTimeout(()=>{
		this.displayMessage([
			[3,3,3,3,3,3,3,3],
			[3,3,6,6,6,6,3,3],
			[3,3,3,3,3,6,3,3],
			[3,3,3,3,6,6,3,3],
			[3,3,6,6,3,3,3,3],
			[3,3,6,3,3,3,3,3],
			[3,3,6,6,6,6,3,3],
			[3,3,3,3,3,3,3,3],
		])},2000)
		setTimeout(()=>{
				this.allRed()
		},2950)
		setTimeout(()=>{
		this.displayMessage([
			[3,3,3,3,3,3,3,3],
			[3,3,3,3,6,3,3,3],
			[3,3,3,6,6,3,3,3],
			[3,3,6,3,6,3,3,3],
			[3,3,3,3,6,3,3,3],
			[3,3,3,3,6,3,3,3],
			[3,3,3,6,6,6,3,3],
			[3,3,3,3,3,3,3,3],
		])},3000)
		setTimeout(()=>{
				this.allRed()
		},3950)

		for( let i = 0; i < 15; i++){
			setTimeout(()=>{
			this.displayMessage([
				[3,3,3,3,3,3,3,3],
				[6,6,6,6,3,6,6,6],
				[6,3,3,6,3,6,3,6],
				[6,3,3,3,3,6,3,6],
				[6,3,6,6,3,6,3,6],
				[6,3,3,6,3,6,3,6],
				[6,6,6,6,3,6,6,6],
				[3,3,3,3,3,3,3,3],
			])},4000+i*150)
			setTimeout(()=>{
					this.allRed()
			},4075+i*150)
		}
	}

	allButton=(value)=>{
		for( let x = 1; x<10; x++){
			for(let y = 1; y<9; y++){
				this.sendMessage(x+y*10, value)
			}
		}
	}
	allGreen=()=>{this.allButton(60)}
	allRed=()=>{this.allButton(5)}
	allYellow=()=>{this.allButton(62)}
	allAmber=()=>{this.allButton(1)}
	allOff=()=>{this.allButton(12)}

	greenLed = (note)=> { this.sendMessage(note,60) }
	redLed = (note)=> { this.sendMessage(note,5) }
	yellowLed = (note)=> { this.sendMessage(note,62)}
	amberLed = (note) => { this.sendMessage(note,1) }
	offLed=(note)=>{ this.sendMessage(note,12) }
}

module.exports = LaunchpadMK2
