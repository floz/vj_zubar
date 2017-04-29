#define PHONG

attribute vec3 position;
attribute vec3 normal;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;

varying vec3 vViewPosition;

uniform float offsetID;
uniform float dataOffset;
uniform float scale;

uniform sampler2D data;

attribute float id;

varying float vLengthRatio;

#ifndef FLAT_SHADED

	varying vec3 vNormal;

#endif

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>

mat3 matrixFromEuler(vec3 euler)
{
	mat3 m;

	float a = cos(euler.x);
	float b = sin(euler.x);
	float c = cos(euler.y);
	float d = sin(euler.y);
	float e = cos(euler.z);
	float f = sin(euler.z);

	float ae = a * e;
	float af = a * f;
	float be = b * e;
	float bf = b * f;

	m[0][0] = c * e;
	m[0][1] = - c * f;
	m[0][2] = d;

	m[1][0] = af + be * d;
	m[1][1] = ae - bf * d;
	m[1][2] = - b * c;

	m[2][0] = bf - ae * d;
	m[2][1] = be + af * d;
	m[2][2] = a * c;

  return m;
}

void main() {

	  vec3 position = position;

	float pointID = mod(id + offsetID, POINTS_NUMBER) + dataOffset;

	vec4 dataChunk1 = texture2D(data, vec2(mod(pointID, WIDTH * .5) / WIDTH * 2., floor(pointID / WIDTH * 2.) / HEIGHT));
	vec4 dataChunk2 = texture2D(data, vec2(mod(pointID + .5, WIDTH * .5) / WIDTH * 2., floor((pointID + .5) / WIDTH * 2.) / HEIGHT));

	vec3 point = dataChunk1.xyz;
	float radius = dataChunk1.w;
	vec3 rotation = dataChunk2.xyz;
	float type = dataChunk2.w;

	float lengthRatio = id / POINTS_NUMBER;

	vLengthRatio = lengthRatio;

	position *= radius * scale * lengthRatio;

	mat3 rotationMatrix = matrixFromEuler(rotation);
	position *= rotationMatrix;

	position += point;

	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>

	#include <begin_vertex>
	#include <displacementmap_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>

}
