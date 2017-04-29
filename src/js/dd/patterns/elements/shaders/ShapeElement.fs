#include <common>
#include <packing>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

uniform sampler2D tShape;
uniform vec3 color;
uniform vec3 bgColor;
uniform float opacity;

varying vec2 vUv;

void main() {

  vec4 dataShape = texture2D( tShape, vUv );
  dataShape.a *= opacity;
  if( dataShape.a == 0. ) discard;
  gl_FragColor = vec4( color + color * bgColor * .4, opacity );

  #include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>

}
