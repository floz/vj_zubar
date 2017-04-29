//
// Wrapper for requestAnimationFrame, Resize & Update
// this.author : David Ronai / this.Makio64 / makiopolis.com
//

const Signals = require("mnf/events/Signals")
const stage = require("mnf/core/stage")

//------------------------
class Stage3d{

	constructor(){
		this.camera 	= null
		this.scene 		= null
		this.renderer 	= null
		this.usePostProcessing 		= false
		this.passes 				= []
		this.isActivated 			= false
		this.clearAuto				= true
		this.clearAlpha				= 1

		this.onBeforeRenderer = new Signals()

		let w = stage.width
		let h = stage.height

		this.camera = new THREE.PerspectiveCamera( 50, w / h, 1, 1000000 )
		this.scene = new THREE.Scene()

		// orthographic scene for buffer
		this.scene2 = new THREE.Scene()
		this.orthoCamera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, 0, 1 )
		this.mesh =  new THREE.Mesh( new THREE.PlaneBufferGeometry( 1, 1 ), new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:this.clearAlpha}) )
		this.scene2.add( this.mesh )

		const attributes = { alpha:true, antialias:true, preserveDrawingBuffer:true }

		this.scene.fog = new THREE.Fog( 0x000000, 0, 5000 )

		this.resolution = new THREE.Vector2(1, h/w)
		this.renderer = new THREE.WebGLRenderer( attributes )
		this.renderer.setPixelRatio( stage.pixelRatio )
		this.renderer.domElement.className = 'three'
		this.renderer.setSize( w, h )
		this.renderer.setClearColor( 0, this.clearAlpha )

		stage.onUpdate.add(this.render)
		stage.onResize.add(this.resize)
		document.body.appendChild(this.renderer.domElement)
	}

	initPostProcessing = ()=>{
		this.usePostProcessing 		= true
		this.composer = new WAGNER.Composer( this.renderer, {useRGBA: true} )
		this.composer.setSize( this.renderer.domElement.width, this.renderer.domElement.height )
	}

	add = (obj)=>{
		this.scene.add(obj)
	}

	remove = (obj)=>{
		this.scene.remove(obj)
	}

	getObjectByName = ( name )=>{
		return this.scene.getObjectByName( name )
	}

	addPass = (pass)=>{
		this.passes.push(pass)
	}

	addPassFirst( pass ) {
		this.passes.unshift( pass )
	}

	removePass = ( pass ) => {
		let idx = this.passes.indexOf( pass )
		if( idx > -1 ) {
			console.log( idx )
			this.passes.splice( idx, 1 )
		}
	}

	render = (dt)=> {
		this.renderer.autoClearColor = this.clearAuto
		this.renderer.autoClear = this.clearAuto
		this.mesh.material.opacity = this.clearAlpha

		if(this.control){
			this.control.update(dt)
		}

		this.onBeforeRenderer.dispatch()

		if(this.usePostProcessing){
			// this.composer.reset()
			// this.composer.render( this.scene2, this.orthoCamera )
			// this.composer.toScreen()
			this.composer.reset()
			this.composer.render( this.scene, this.camera )
			for( let i = 0, n = this.passes.length; i < n; i++ ) {
				let pass = this.passes[ i ]
				this.composer.pass( pass )
			}
			this.composer.toScreen()
		}
		else{
			this.renderer.render(this.scene, this.camera)
		}
	}

	setBackgroundColor( color ) {
		this.scene.background = new THREE.Color( color );
	}

	resize = ()=>{
		this.camera.aspect = stage.width / stage.height
		this.camera.updateProjectionMatrix()
		this.renderer.setSize( stage.width, stage.height )
		this.renderer.setPixelRatio( stage.pixelRatio )
		this.resolution.y = stage.height / stage.width

		this.render(0)
		if(this.composer){
			this.composer.setSize( this.renderer.domElement.width, this.renderer.domElement.height )
		}
	}
}

module.exports = new Stage3d()
