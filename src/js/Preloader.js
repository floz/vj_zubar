// Preloader of the main bundle

// if(isProduction){
// 	require('offline-plugin/runtime').install()
// }

class Preloader {

	constructor(){
		document.addEventListener('DOMContentLoaded', this.init)
	}

	init(){
		document.removeEventListener('DOMContentLoaded', Preloader.init)
		require.ensure(['./Main'], (require)=>{
			new ( require('./Main' ) )()
		})
	}
}

module.exports = new Preloader()
