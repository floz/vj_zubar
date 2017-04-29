const FBO = require('./FBO')
const stage = require('mnf/core/stage')

class ParticleFBO extends THREE.Points{

	constructor({width = 512, height = 512, renderMaterial = null, simulationMaterial = null} = {}){

		const size = width * height
		const positions = new Float32Array( size*3 )
		for( let i = 0; i< positions.length; i++ ){
			positions[ i * 3 ] = ( i % width ) / width
			positions[ i * 3 + 1 ] = Math.floor( i / width ) / height
		}

		const geometry = new THREE.BufferGeometry()
		geometry.addAttribute( 'position',  new THREE.BufferAttribute( positions, 3 ) )

		super(geometry, renderMaterial)

		this.simulationMaterial = simulationMaterial
		this.renderMaterial = renderMaterial
		this.fbo = new FBO( width, height, simulationMaterial )
		// this.fbo.debug()

		stage.onUpdate.add(this.update)
	}

	switchToSim(material){
		this.simulationMaterial = material
		this.fbo.setSimulation(material)
	}

	update = (dt) => {
		this.fbo.update(dt)
		this.renderMaterial.uniforms.t_pos.value = this.fbo.rt2
		this.renderMaterial.uniforms.t_oPos.value = this.fbo.rt3
	}
}
module.exports = ParticleFBO
