#include <common>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

#include <shadowmap_pars_vertex>

void main() {

  vec3 pos = position;
  mat4 m = projectionMatrix * modelViewMatrix;
  gl_Position = m * vec4( pos, 1.0 );

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

}
