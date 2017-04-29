module.exports = new dat.GUI()


setTimeout(()=>{
	let doms = document.querySelectorAll('.slider')
	for(let dom of doms){
		dom.addEventListener('mousedown',(e)=>{
			// e.stopImmediatePropagation()
			e.stopPropagation()
		},false)
	}
},500)
