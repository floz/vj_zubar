precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 prev;
attribute vec3 curr;
attribute vec3 next;
attribute float side;

uniform float lineWidth;

void main() {

	mat4 m = projectionMatrix * modelViewMatrix;

	vec4 finalPosition = m * vec4( position, 1.0 );

	vec4 prevPos = m * vec4( prev, 1.0 );
	vec4 currPos = m * vec4( curr, 1.0 );
	vec4 nextPos = m * vec4( next, 1.0 );

  vec3 bn = normalize( cross( nextPos.xyz - currPos.xyz, currPos.xyz - prevPos.xyz ) );

  finalPosition.xyz = finalPosition.xyz + bn * lineWidth * side;
  // vec3 normal = normalize(cross( bn, finalPosition.xyz - prevPos.xyz));

	gl_Position = finalPosition;
}
