const stage3d = require('mnf/core/stage3d')

class SimpleFBO {

  constructor( width, height, uniformsSim, fragmentSim ) {
    this.width = width
    this.height = height

    this.renderer = stage3d.renderer

    const options = {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat,
			type: THREE.HalfFloatType,
			encoding: THREE.LinearEncoding,
			stencilBuffer: true,
			depthBuffer: false,
    }

    this.rtCurrent = new THREE.WebGLRenderTarget( this.width, this.height, options )
    this.rtCurrent.texture.generateMipmaps = false

    this.rtPrev = new THREE.WebGLRenderTarget( this.width, this.height, options )
    this.rtPrev.texture.generateMipmaps = false

    this.scene = new THREE.Scene()
    this.orthoCamera = new THREE.OrthographicCamera( -0.5, 0.5, 0.5, -0.5, 0, 1 )

    uniformsSim.tSimCurr = { type: "t", value: this.rtCurrent.texture }
    this.simMaterial = new THREE.ShaderMaterial( {
			uniforms: uniformsSim,
			vertexShader: require( "./shaders/copy.vs" ),
			fragmentShader: fragmentSim,
			depthWrite: false,
			depthTest: false,
		} )
    this.simMaterial.type = "SimpleFBOMaterial"

    this.mesh =  new THREE.Mesh( new THREE.PlaneBufferGeometry( 1, 1, 1, 1 ), this.simMaterial )
		this.scene.add( this.mesh )

    // this.update()
  }

  getDebugMesh() {
    if( !this.debugMesh ) {
      this.debugMesh = this.createDebugMeshCurrent()
    }
    return this.debugMesh
  }

  createDebugMeshCurrent() {
    const geo = new THREE.PlaneBufferGeometry( this.width, this.height )
    const mat = new THREE.ShaderMaterial( {
			uniforms: {
        t_pos: { type: "t", value: this.rtCurrent.texture }
			},
			vertexShader: require( "./shaders/copy.vs" ),
			fragmentShader: require( "./shaders/copy.fs" ),
			depthWrite: false,
			depthTest: false,
      side: THREE.DoubleSide
		} )
    return new THREE.Mesh( geo, mat )
  }

  createDebugMeshPrev() {
    const geo = new THREE.PlaneBufferGeometry( this.width, this.height )
    const mat = new THREE.ShaderMaterial( {
			uniforms: {
        t_pos: { type: "t", value: this.rtPrev.texture }
			},
			vertexShader: require( "./shaders/copy.vs" ),
			fragmentShader: require( "./shaders/copy.fs" ),
			depthWrite: false,
			depthTest: false,
      side: THREE.DoubleSide
		} )
    return new THREE.Mesh( geo, mat )
  }

  update() {
    this.renderer.render( this.scene, this.orthoCamera, this.rtCurrent, false )

    this.simMaterial.uniforms.tSimCurr.value = this.rtCurrent.texture

    const rtTmp = this.rtCurrent
    this.rtCurrent = this.rtPrev
    this.rtPrev = rtTmp
  }

  getTexture() {
    return this.rtCurrent.texture
  }

}

module.exports = SimpleFBO
