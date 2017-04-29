#include <common>
#include <packing>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

uniform vec3 color;
uniform vec3 bgColor;
uniform float opacity;

void main() {

  if( opacity == 0. ) discard;
  gl_FragColor = vec4( color + color * bgColor * .4, opacity );

  #include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>

}
