uniform sampler2D t_pos;
uniform float size;
uniform float sizeVariation;

void main() {
	vec3 pos = texture2D( t_pos, position.xy ).xyz;
	gl_PointSize = size;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}
