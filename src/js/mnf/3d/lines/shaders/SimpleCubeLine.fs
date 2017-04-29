#extension GL_OES_standard_derivatives : enable
precision mediump float;

uniform vec3 color;
uniform float opacity;

void main(void) {
	gl_FragColor = vec4(color, opacity);
}
