#define PI 3.14159265359

uniform sampler2D tInput;
varying vec2 vUv;

uniform float gamma;
uniform float contrast;
uniform float brightness;

uniform float toEnd;
uniform float resolutionX;
uniform float resolutionY;
uniform float mirrorX;
uniform float mirrorY;
uniform float angle;
uniform float glitchOffsetX;
uniform float glitchOffsetY;
uniform float glitchRatio;
uniform float divide4;
uniform float vignetteFallOff;
uniform float vignetteAmount;
uniform float invertRatio;
uniform float sectionsKaleid;
uniform float kaleidActivated;
uniform float blackAndWhite;
uniform sampler2D tNoise;

uniform float amount;
uniform float speed;
uniform float time;

const float TAU = 2. * PI;

highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
vec3 toGamma( vec3 rgb ) {
  return pow( rgb, vec3( 1.0 / gamma ) );
}

vec2 fix( vec4 i, float aspect ) {
	vec2 res = i.xy / i.w;
	res.x *= aspect;
	return res;
}

void main() {
	float aspect = resolutionX / resolutionY;

	vec2 uv = vUv;
  if(divide4>0.){ uv *= 2.; uv = mod(uv,vec2(1.)); }
	if(mirrorX>0.){ uv.x = abs(uv.x*aspect-.5*aspect)+.5; }
	if(mirrorY>0.){ uv.y = abs(uv.y-.5)+.5; }

	float sin_factor = sin(angle);
  float cos_factor = cos(angle);
  vec2 origin = vec2(0.5 ,0.5);

  vec2 temp = (uv - origin);

  temp = temp * mat2(cos_factor, sin_factor, -sin_factor, cos_factor);

  uv = (temp + origin);

	vec2 pos = vec2( uv - .5 );

	float rad = length(pos);
  float a = atan(pos.y, pos.x);

  float ma = mod(a, TAU/sectionsKaleid);
  ma = abs(ma - PI/sectionsKaleid);

  float x = cos(ma) * rad;
  float y = sin(ma) * rad;

	vec2 uvFinal = vec2( x, y ) * kaleidActivated + uv * ( 1. - kaleidActivated );

	vec4 color = texture2D(tInput, uvFinal );

	// glitch

	float time2 = time * .001;

	vec2 block = floor(uv * vec2(glitchOffsetX, glitchOffsetY));
	vec2 uv_noise = block / vec2(64);
	uv_noise += floor(vec2(time2) * vec2(1234.0, 3543.0)) / vec2(64);

	float block_thresh = pow(fract(time2 * 1236.0453), 2.0) * 0.2 * glitchRatio;
	float line_thresh = pow(fract(time2 * 2236.0453), 3.0) * 0.7 * glitchRatio;

	vec2 uv_r = uvFinal, uv_g = uvFinal, uv_b = uvFinal;

	// // glitch some blocks and lines
	if (texture2D(tNoise, uv_noise).r < block_thresh ||
		  texture2D(tNoise, vec2(uv_noise.y, 0.0)).g < line_thresh) {

		vec2 dist = (fract(uv_noise) - 0.5) * 0.3;
		uv_r += dist * 0.;
		uv_g += dist * 0.025;
		uv_b += dist * 0.04;
	}

	color.r = texture2D(tInput, uv_r).r;
	color.g = texture2D(tInput, uv_g).g;
	color.b = texture2D(tInput, uv_b).b;

	//loose luma for some blocks
	if (texture2D(tNoise, uv_noise).g < block_thresh)
		color.rgb = color.ggg;

	//discolor block lines
	if (texture2D(tNoise, vec2(uv_noise.y, 0.0)).b * 3.5 < line_thresh)
		color.rgb = vec3(0.0, dot(color.rgb, vec3(1.0)), 0.);

	//interleave lines in some blocks
	if (texture2D(tNoise, uv_noise).g * 1.5 < block_thresh ||
		texture2D(tNoise, vec2(uv_noise.y, 0.0)).g * 2.5 < line_thresh) {
		float line = fract(uv.y / 3.0);
		vec3 mask = vec3(1.0, 1.0, 1.0);
		if (line > 0.333)
			mask = vec3(0.0, 0.0, 1.0);
		if (line > 0.666)
			mask = vec3(1.0, 0.0, .25);

		color.xyz *= mask;
	}

  // rgb modifs
	vec3 rgb = toGamma( color.rgb );
	rgb = rgb * contrast;
	rgb = rgb + vec3( brightness );

  // noise
	float dx = rand( vUv * 100. );
  rgb += rgb * clamp( 0., 0.1 + dx, 1.0 ) * .125;

	// //invert
	rgb = mix(rgb, (1. - rgb),invertRatio);

	// //Vignette
	float dist = distance(uv, vec2(0.5, 0.5));
	rgb *= smoothstep(0.8, vignetteFallOff * 0.799, dist * (vignetteAmount + vignetteFallOff));

	vec4 rgbFinal = vec4( rgb, 1. ) * ( 1. - toEnd ) + vec4( 0, 0.13333 * .5, 0.0745 * .5, 1. ) * toEnd;
	rgbFinal.rgb = rgbFinal.rgb * ( 1. - blackAndWhite ) + ( rgbFinal.rrr + rgbFinal.ggg + rgbFinal.bbb ) / 3. * blackAndWhite;
	gl_FragColor = rgbFinal;
	// gl_FragColor = vec4( texture2D(tNoise, uv_noise).rgb, 1. );

}
