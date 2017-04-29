// Manage transition betweenScene
//
// @usage SceneTraveler.to( new Scene() )
// @author David Ronai / Makiopolis.com / @Makio64

const stage = require('mnf/core/stage')

class SceneTraveler {

	constructor( debug = true ) {
		this.debug = debug
		this.currentScene	= null
		this.nextScene = null
		stage.onUpdate.add(this.update)
		stage.onResize.add(this.resize)
	}

	to = ( scene )=>{
		this.nextScene = scene
		if ( this.currentScene ){
			this.currentScene.transitionOut()
		}
		else {
			this.onTransitionOutComplete()
		}
	}

	update = ( dt )=>{
		if(this.currentScene){
			this.currentScene.update(dt)
		}
	}

	onTransitionOutComplete = ()=>{
		this.currentScene = this.nextScene
		if( this.debug ) {
			console.log('travel to :',this.currentScene.name)
		}
		this.currentScene.transitionIn()
	}

	resize = ()=>{
		if(this.currentScene && this.currentScene.resize){
			this.currentScene.resize()
		}
		if(this.nextScene && this.nextScene.resize){
			this.nextScene.resize()
		}
	}

}

const sceneTraveler = new SceneTraveler()
module.exports = sceneTraveler
module.exports.SceneTraveler = SceneTraveler
