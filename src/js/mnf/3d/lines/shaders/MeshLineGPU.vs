
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform sampler2D positions;
uniform float lineLength;
uniform float offsetID;

attribute float id;
attribute vec2 uv;
attribute float side;

uniform vec2 resolution;
uniform float lineWidth;

vec2 fix( vec4 i, float aspect ) {
	vec2 res = i.xy / i.w;
	res.x *= aspect;
	return res;
}

vec2 getPos(float idx){
	return vec2( mod(idx, WIDTH) / WIDTH, floor(idx / WIDTH) / HEIGHT );
}

void main() {

	float aspect = resolution.x / resolution.y;

	mat4 m = projectionMatrix * modelViewMatrix;
	vec4 finalPosition = m * vec4( texture2D(positions,getPos(id)).rgb, 1.0 );
	vec4 prevPos = m * vec4( texture2D(positions,getPos(id-1.)).rgb, 1.0 );
	vec4 nextPos = m * vec4( texture2D(positions,getPos(id+1.)).rgb, 1.0 );

	vec2 prevP = fix( prevPos, aspect );
	vec2 nextP = fix( nextPos, aspect );

	vec2 dir = normalize( nextP - prevP );
	finalPosition.xy += vec2( -dir.y/aspect, dir.x ) * lineWidth * side * lineWidth;
	gl_Position = finalPosition;
}
