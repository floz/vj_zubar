const NumberButton = require('./NumberButton')

class BooleanButton extends NumberButton {

	constructor(obj, value, midiNote, midi){
		super(obj, value, midiNote, midi)
		this._switchMode = true
		this.easing = 1

		this.isOn = (this.obj[this.value] == 1 || this.obj[this.value] == true)
		this.colorOn = 62
		this.colorOff = 29
		this._realBoolean = false
		this.min = 0
		this.max = 1
		this.updateLed()
	}

	onMidi = (e)=>{
		if(e.note==this.midiNote){
			if(this._switchMode){
				if(e.velocity==1){
					this.isOn = !this.isOn
					this.switchTo(this.isOn)
				}
			} else {
				this.isOn = (e.velocity==1)
				this.switchTo(this.isOn)
			}
		}
	}

	realBoolean(value){
		this._realBoolean = value
		return this
	}

	switchMode(value){
		this._switchMode = value
		return this
	}

	colors=(colorOn=60,colorOff=29)=>{
		this.colorOn = colorOn
		this.colorOff = colorOff
		this.updateLed()
		return this
	}

	switchOff=()=>{
		this.isOn = false
		this.targetValue = this._realBoolean?false:this.min
		this.updateLed()
		return this
	}

	switchOn=()=>{
		this.isOn = true
		this.targetValue = this._realBoolean?true:this.max
		this.updateLed()
		return this
	}

	switchTo=(value)=>{
		if(value){ this.switchOn() }
		else{ this.switchOff() }
		this._onChange.dispatch(this.targetValue)
	}

	onChange = (onChangeCB)=> {
		this.onChangeCB = onChangeCB
		this._onChange.add(this.onChangeCB)
		return this
	}

	updateLed=()=>{
		this.midi.sendMessage(this.midiNote,this.isOn?this.colorOn:this.colorOff)
	}
}

module.exports = BooleanButton
