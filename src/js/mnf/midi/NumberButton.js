const stage = require('mnf/core/stage')
const Signal = require('mnf/events/Signals')

class NumberButton{

	constructor(obj,value,midiNote,midi){
		this.obj = obj
		this.value = value
		this.midiNote = midiNote
		this.midi = midi

		this._onChange = new Signal()
		this.targetValue = this.obj[this.value]
		this.min = 0
		this.max = 1
		this.easing = 1
		this.easingFunction = null

		stage.onUpdate.add(this.onUpdate)

    if( midi.onMessage ) {
	    setTimeout(()=>midi.onMessage.add(this.onMidi),10)
    }

	}

	minMax = (min,max)=> {
		this.min = min
		this.max = max
		return this
	}

	ease = (easing,easingFunction=null)=> {
		this.easing = easing
		if(easingFunction){
			this.easingFunction = easingFunction
		}
		return this
	}

	onMidi = (e)=> {
		if(e.note==this.midiNote && e.velocity){
			this.targetValue = this.min + e.velocity * (this.max - this.min)
			this._onChange.dispatch(this.targetValue)
		}
	}

	onUpdate = (dt)=> {
		let t = 0
		if(this.easingFunction){
			t = this.easingFunction(this.targetValue)
		}
		else{
			t = this.targetValue
		}
		this.obj[this.value] += (t-this.obj[this.value]) * this.easing
		if(t==0 && this.obj[this.value] < 0.01) { this.obj[this.value] = 0 }
	}

	onChange = (onChangeCB)=> {
		this.onChangeCB = onChangeCB
		this._onChange.add(this.onChangeCB)
		return this
	}
}

module.exports = NumberButton
