
attribute vec3 position;
attribute vec3 normal;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float offsetID;
uniform float dataOffset;
uniform float scale;

uniform sampler2D data;

attribute float id;

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
	// float type = dataChunk2.w;

	float lengthRatio = id / POINTS_NUMBER;

	position *= radius * scale * lengthRatio * smoothstep(.0, 0.3, 1.-lengthRatio);
	position *= matrixFromEuler(rotation);
	position += point;
	// position += normal * curlNoise(vec3(lengthRatio)*3.) * 30. * smoothstep(.6, 1., 1.-lengthRatio);

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
