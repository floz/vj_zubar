class AudioTexture extends THREE.DataTexture {

	constructor({length=128, history=128} = {}){
		this.length = length
		this.history = history

		this.data = new Float32Array(length * history)

		for( let i = 0; i < this.data.length; i++){
			this.data[i] = 0.1
		}

		super( this.data, this.length, this.history, THREE.LuminanceFormat, THREE.FloatType, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestFilter, 1 )
		this.needsUpdate = true
	}

	update = (data)=> {

		const l = data.length
		for( let i = this.history-1; i > 0; i--){
			for( let j = this.length-1; i >= 0; i--){
				this.data[(i*l+j)+1] = this.data[ ((i-1)*l+j)+1 ]
			}
		}

		for( let i = 0; i <data.length; i++){
			this.data[ i ] = data[i]/255
		}

		this.needsUpdate = true
	}
}

module.exports = AudioTexture
