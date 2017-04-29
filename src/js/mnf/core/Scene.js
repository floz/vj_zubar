// Abstract Scene
// @author David Ronai / Makiopolis.com / @Makio64

const sceneTraveler = require('mnf/core/sceneTraveler')

class Scene {

	constructor( name = "default" ){
		this.name = name
	}

	update(dt){}

	resize(){}

	transitionIn(){ this.onTransitionInComplete() }

	transitionOut(){ this.onTransitionOutComplete()}

	onTransitionInComplete = ()=>{}

	onTransitionOutComplete = ()=>{
		this.dispose()
		sceneTraveler.onTransitionOutComplete()
	}

	dispose(){}
}

module.exports = Scene
