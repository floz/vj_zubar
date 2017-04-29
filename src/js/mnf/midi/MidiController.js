const BooleanButton = require('./BooleanButton')
const NumberButton = require('./NumberButton')

class MidiController {

	add = (obj, value, midiNote, isBoolean=false) => {
		if(isBoolean){
			return new BooleanButton(obj,value,midiNote,this)
		}
		else{
			return new NumberButton(obj,value,midiNote,this)
		}
	}

	addGroup = (buttons)=> {
		for( let b of buttons ){
			b.onChange((v,d)=>{
				for( let c of buttons){
					if(b!=c){
						c.switchOff()
						console.log('off')
					}else{
						console.log('wow')
						c.switchOn()
					}
				}
			},this,1000)
		}
	}

	sendMessage() {}
	allButton() {}

	allGreen() {}
	allRed() {}
	allYellow() {}
	allAmber() {}
	allOff() {}

	greenLed() {}
	redLed() {}
	yellowLed() {}
	amberLed() {}
	offLed() {}

}

module.exports = MidiController
