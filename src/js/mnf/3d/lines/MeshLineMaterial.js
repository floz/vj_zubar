const vs = require('./shaders/MeshLine.vs')
const fs = require('./shaders/MeshLine.fs')
const stage3d = require('mnf/core/stage3d')

class MeshLineMaterial extends THREE.RawShaderMaterial{

	constructor( {lineWidth = 1, vertexShader=vs, fragmentShader=fs, depthWrite=true, depthTest=true, resolution=stage3d.resolution, color=0xFFFFFF, opacity=1, transparent=true, uniforms={} } = {}){

		uniforms.lineWidth = uniforms.lineWidth || { type: 'f', value: lineWidth }
		uniforms.resolution = uniforms.resolution || { type: 'v2', value: resolution }
		uniforms.color = uniforms.color || { type: 'v3', value: new THREE.Color(color) }
		uniforms.opacity = uniforms.opacity || { type: 'f', value: opacity }

		super( {
			uniforms:uniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			transparent: transparent,
			depthWrite: depthWrite,
			depthTest: depthTest
		})
		this.type = 'MeshLineMaterial'
	}
}

module.exports = MeshLineMaterial
