#define PHONG

uniform vec3 color;
uniform vec3 tipColor;

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float emissiveIntensity;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

varying float vLengthRatio;

#include <common>
#include <packing>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

  vec3 color = mix(color, tipColor, smoothstep(.9, 1., vLengthRatio));

	vec4 diffuseColor = vec4( color, opacity );
	vec3 totalAmbientLight = ambientLightColor;
	vec3 totalEmissiveLight = color;
	vec3 shadowMask = vec3( 1.0 );

	totalEmissiveLight *= emissiveIntensity;
	diffuseColor.rgb *= (1. - emissiveIntensity);

	// vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_flip>
	#include <normal_fragment>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_phong_fragment>
	#include <lights_template>

	// modulation
	#include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

	#include <envmap_fragment>

  outgoingLight = mix(outgoingLight, vec3(1.), step(.9985, vLengthRatio));

	float depth = gl_FragCoord.z / gl_FragCoord.w;
	float fade = smoothstep(0.1, 10.0, depth);

	gl_FragColor = vec4( outgoingLight, diffuseColor.a * vLengthRatio * fade );

	#include <premultiplied_alpha_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>

}
