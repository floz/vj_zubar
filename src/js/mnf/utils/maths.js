const clamp = module.exports.clamp = ( value, min, max ) => {
	return Math.max( min, Math.min( value, max ) )
}

const map = module.exports.map = (value,min,max) =>{
	return clamp((value - min) / (max-min),0,1)
}

const angleDistance = module.exports.angleDistance = ( alpha, beta) => {
	const phi = Math.abs(beta - alpha) % Math.PI*2;
	return phi > Math.PI ? Math.PI*2 - phi : phi;
}

module.exports.angleDistanceSign = ( alpha, beta) => {
	const sign = (alpha - beta >= 0 && alpha - beta <= Math.PI) || (alpha - beta <=-Math.PI && alpha- beta>= -Math.PI*2) ? 1 : -1;
	return angleDistance( alpha, beta) * sign;
}
