const stage = require("mnf/core/stage")
const Signal = require('mnf/events/Signals')

class Audio {

	constructor() {

		this.context = new AudioContext()
		this.masterGain = this.context.createGain()


		this.onCanPlay = new Signal()

		this.onBeat = new Signal()
		this.waveData = []
		this.levelsData = []
		this.volumeHistory = []

		this.BEAT_HOLD_TIME = 60 * 4
		this.BEAT_DECAY_RATE = 0.6
		this.BEAT_MIN = 8.9

		this.globalVolume = 1
		this.volume = 0
		this.bpmTime = 0
		this.msecsAvg = 633
		this.globalVolume = 1
		this.currentPlay = -1
		this.fist = ''

		this.levelsCount = 16
		this.beatCutOff = 0
		this.beatTime = 0

		this.time = 0
	}

	start({onLoad=null, live=true, analyze=true, debug=false, playlist=["audio/galvanize.mp3"], shutup=false} = {}){

		this.debug = debug
		this.playlist = playlist

		if(!live){
			if(!shutup){
				this.masterGain.connect(this.context.destination)
			}
			this.playNext()
			if(onLoad){
				onLoad()
			}
		}

		else{
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
			navigator.getUserMedia( {audio: true,video:false},
				(stream)=>{
					let mediaStream = this.context.createMediaStreamSource(stream);
					let tracks = stream.getAudioTracks()
					mediaStream.connect( this.masterGain )
					if(onLoad){
						onLoad()
					}
				},
				(e)=>console.log('fail load stream\n',e)
			)
		}

		if(analyze){
			this.analyze()
		}
	}

	playNext = ()=>{
		this.currentPlay++
		if(this.currentPlay >= this.playlist.length){
			this.currentPlay = 0
		}

		this.audio = document.createElement( 'audio' )
		this.audio.oncanplay = this.canplay
		this.audio.src = this.playlist[this.currentPlay]
		this.audio.loop = false
		// this.audio.play()
		this.audio.addEventListener('ended', this.onEnded)
		this.audio.currentTime = 0

		if(this.audioSource){
			this.audioSource.disconnect( this.masterGain )
		}
		this.audioSource = this.context.createMediaElementSource( this.audio )
		this.audioSource.connect( this.masterGain )

	}

	canplay = () => {
		this.onCanPlay.dispatch()
		// this.audio.play()
	}

	onEnded = () => {
		console.log( "ended!" )
	}

	analyze(){
		this.analyser = this.context.createAnalyser()
		this.analyser.smoothingTimeConstant = 0.3
		this.analyser.fftSize = 1024
		this.binCount = this.analyser.frequencyBinCount
		this.levelBins = Math.floor(this.binCount / this.levelsCount)
		this.freqByteData = new Uint8Array(this.binCount)
		this.timeByteData = new Uint8Array(this.binCount)
		this.masterGain.connect( this.analyser)

		for(let i = 0; i <256; i++){
			this.volumeHistory.push(0)
		}
		stage.onUpdate.add(this.update)
	}

	update = (dt)=> {
		this.analyser.getByteFrequencyData(this.freqByteData)
		this.analyser.getByteTimeDomainData(this.timeByteData)

		for(let i=0; i<this.binCount; i++){
			this.waveData[i] = ((this.timeByteData[i] - 128) /128 )
		}

		this.volume = 0
		for(let i=0; i < this.levelsCount; i++){
			let sum = 0
			for(let j=0; j<this.levelBins; j++){
				sum += this.freqByteData[(i * this.levelBins) + j]
				this.levelsData[i] = sum / this.levelBins / 256
			}
			this.volume += sum/this.levelBins/256
		}
		this.volume *= this.globalVolume
		if(this.debug){
			console.log('volume:',this.volume)
		}
		this.detectBeat(dt)

		// this.time = this.audio.currentTime * 1000
		// console.log( this.time )

		// console.log( this.time )
	}

	detectBeat = (dt)=>{
		this.volumeHistory.shift(1)
		this.volumeHistory.push(this.volume)

		if (this.beatTime >= this.BEAT_HOLD_TIME && this.volume  > this.beatCutOff && this.volume > this.BEAT_MIN){
			if(this.debug){
				console.log('Beat detected')
			}
			this.onBeat.dispatch()
			this.beatCutOff = this.volume *1.1
			this.beatTime = 0
		}
		else {
			if (this.beatTime <= this.BEAT_HOLD_TIME){
				this.beatTime+=dt
			}
			else{
				this.beatCutOff *= this.BEAT_DECAY_RATE
				this.beatCutOff = Math.max(this.beatCutOff,this.BEAT_MIN)
			}
		}
	}
}

module.exports = new Audio()
