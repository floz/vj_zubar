const stage3d = require('mnf/core/stage3d')

class FBO{

	constructor( width, height, simulation ){

		this.simulation = simulation
		// this.renderer = new THREE.WebGLRenderer({
		// 	alpha:false,
		// 	stencil:true,
		// })
		// this.renderer.setSize(width, height)

		this.renderer = stage3d.renderer

		const options = {
			wrapS: THREE.RepeatWrapping,
			wrapT: THREE.RepeatWrapping,
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat,
			type: THREE.FloatType,
			encoding: THREE.LinearEncoding,
			stencilBuffer: true,
			depthBuffer: false,
		}

		this.rt = new THREE.WebGLRenderTarget(width, height, options)
		this.rt2 = new THREE.WebGLRenderTarget(width, height, options)
		this.rt3 = new THREE.WebGLRenderTarget(width, height, options)

		this.rt.texture.generateMipmaps = false
		this.rt2.texture.generateMipmaps = false
		this.rt3.texture.generateMipmaps = false

		this.scene = new THREE.Scene()
		this.orthoCamera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, 0, 1 )
		this.mesh =  new THREE.Mesh( new THREE.PlaneBufferGeometry( 1, 1, 1, 1 ) )
		this.scene.add( this.mesh )
		this.copy()
		this.mesh.material = this.simulation
	}

	setSimulation(simulation){
		this.simulation = simulation
		this.mesh.material = this.simulation
		this.simulation.uniforms.t_pos.value = this.rt3.texture
		this.simulation.uniforms.t_oPos.value = this.rt2.texture
	}

	update = (dt)=> {
		this.renderer.render( this.scene, this.orthoCamera, this.rt, false )
		const tmp = this.rt
		this.rt = this.rt2
		this.rt2 = this.rt3
		this.rt3 = tmp
		this.simulation.uniforms.t_pos.value = this.rt3.texture
		this.simulation.uniforms.t_oPos.value = this.rt2.texture
	}

	copy = ()=>{
		this.mesh.material = new THREE.ShaderMaterial({
			uniforms: {
				t_pos: { type: "t", value: this.simulation.uniforms.t_pos.value }
			},
			vertexShader: require( "fbo/copy.vs" ),
			fragmentShader: require( "fbo/copy.fs" ),
		})
		this.update()
		this.update()
		this.update()
	}

	debug(){
		this.debug1 = new THREE.Mesh(new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({side:THREE.DoubleSide, map:this.rt.texture}))
		this.debug2 = new THREE.Mesh(new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({side:THREE.DoubleSide, map:this.rt2.texture}))
		this.debug3 = new THREE.Mesh(new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({side:THREE.DoubleSide, map:this.rt3.texture}))

		this.debug2.position.x = 2.1
		this.debug3.position.x = -2.1

		stage3d.add(this.debug1)
		stage3d.add(this.debug2)
		stage3d.add(this.debug3)
	}

}

module.exports = FBO
