const vs = require('./shaders/MeshLineGPU.vs')
const fs = require('./shaders/MeshLine.fs')
const stage3d = require('mnf/core/stage3d')

class MeshLineGPUMaterial extends THREE.ShaderMaterial{

	constructor( {lineWidth = 0,texture = null, offsetID=0, lineLength=0, width=0, height=0,vertexShader=vs, fragmentShader=fs, depthWrite=false, depthTest=false, resolution=stage3d.resolution, color=0xFFFFFF, opacity=1, transparent=true, uniforms={} } = {}){
		uniforms.lineLength = uniforms.lineLength || { type: 'f', value:lineLength }
		uniforms.offsetID = uniforms.offsetID || { type: 'f', value:offsetID }
		uniforms.lineWidth = uniforms.lineWidth || { type: 'f', value: lineWidth }
		uniforms.resolution = uniforms.resolution || { type: 'v2', value: resolution }
		uniforms.color = uniforms.color || { type: 'v3', value: new THREE.Color(color) }
		uniforms.opacity = uniforms.opacity || { type: 'f', value: opacity }
		uniforms.positions = { type: 't', value: texture }

		let prefixVS  = "precision highp float;\n"
		prefixVS += "#define WIDTH "+width+".\n"
		prefixVS += "#define HEIGHT "+height+".\n"

		super( {
			uniforms:uniforms,
			vertexShader: prefixVS + vertexShader,
			fragmentShader: fragmentShader,
			transparent: transparent,
			depthWrite: depthWrite,
			depthTest: depthTest,
		})
		this.type = 'MeshLineGPUMaterial'

	}
}

module.exports = MeshLineGPUMaterial
