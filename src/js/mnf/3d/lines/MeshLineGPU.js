const stage = require("mnf/core/stage")
const stage3d = require("mnf/core/stage3d")
const MeshLineGPUGeometry = require('./MeshLineGPUGeometry')
const MeshLineGPUMaterial = require('./MeshLineGPUMaterial')

class MeshLineGPU extends THREE.Mesh {

	constructor( positions, options = {lineWidth = 1, vertexShader=vs, fragmentShader=fs, depthWrite=true, depthTest=true, resolution=stage3d.resolution, color=0xFFFFFF, opacity=1, transparent=true, uniforms={} } = {} ){

		const geometry = new MeshLineGPUGeometry(positions, MeshLineGPUMaterial.DATA_OFFSET/3)
		const material = new MeshLineGPUMaterial(positions,options)

		super(geometry,material)
	}
}

module.exports = MeshLineGPU
