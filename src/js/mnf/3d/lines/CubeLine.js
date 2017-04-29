const TEXTURE_WIDTH = 256;
const TEXTURE_HEIGHT = 256;
const TEXTURE = new THREE.DataTexture(new Float32Array(TEXTURE_WIDTH * TEXTURE_HEIGHT * 4), TEXTURE_WIDTH, TEXTURE_HEIGHT, THREE.RGBAFormat, THREE.FloatType);
let DATA_OFFSET = 0;

class CubeLine extends THREE.Object3D {

	constructor({color=0xFFFFFF*Math.random(), radius=1, pointNumber = 64} = {}) {
		super();

		this.pointNumber = pointNumber//32+Math.floor(Math.random()*5)*8

		const vs = "precision highp float;\n #define POINTS_NUMBER "+this.pointNumber+".\n #define WIDTH "+TEXTURE_WIDTH+".\n#define HEIGHT "+TEXTURE_HEIGHT+".\n"+require( "./shaders/SimpleCubeLine.vs" )
		const fs = require( "./shaders/SimpleCubeLine.fs" )
		this.radius = radius;

		this._time = 0;
		this._bufferOffset = 0;

		this._matrix4Cached1 = new THREE.Matrix4();
		this._eulerCached1 = new THREE.Euler();
		this._vector3Cached1 = new THREE.Vector3();

		this._direction = new THREE.Vector3();
		this._normal = new THREE.Vector3();
		this._binormal = new THREE.Vector3();

		this._previousPosition = new THREE.Vector3();
		this._previousBinormal = new THREE.Vector3();

		let geometry = new THREE.BufferGeometry();

		let vertices = [];
		let vertexIDs = new Float32Array(this.pointNumber * 8 + 8);
		let vertexNormals = [];
		let indexesArray = [];

		let normalRatio = Math.cos(Math.PI * .25);

		for (let i = 0; i < this.pointNumber; i++) {
			vertices.push([-1, -1, 0]);
			vertices.push([1, -1, 0]);
			vertices.push([1, -1, 0]);
			vertices.push([1, 1, 0]);
			vertices.push([1, 1, 0]);
			vertices.push([-1, 1, 0]);
			vertices.push([-1, 1, 0]);
			vertices.push([-1, -1, 0]);

			vertexIDs[i * 8] = i;
			vertexIDs[i * 8 + 1] = i;
			vertexIDs[i * 8 + 2] = i;
			vertexIDs[i * 8 + 3] = i;
			vertexIDs[i * 8 + 4] = i;
			vertexIDs[i * 8 + 5] = i;
			vertexIDs[i * 8 + 6] = i;
			vertexIDs[i * 8 + 7] = i;

			vertexNormals.push([0, -1, 0]);
			vertexNormals.push([0, -1, 0]);
			vertexNormals.push([1, 0, 0]);
			vertexNormals.push([1, 0, 0]);
			vertexNormals.push([0, 1, 0]);
			vertexNormals.push([0, 1, 0]);
			vertexNormals.push([-1, 0, 0]);
			vertexNormals.push([-1, 0, 0]);

			if (!i) {
				continue;
			}

			let index = vertices.length - 16;

			indexesArray.push([index + 0, index + 1, index + 9]);
			indexesArray.push([index + 9, index + 8, index + 0]);

			indexesArray.push([index + 11, index + 10, index + 2]);
			indexesArray.push([index + 2, index + 3, index + 11]);

			indexesArray.push([index + 13, index + 12, index + 4]);
			indexesArray.push([index + 4, index + 5, index + 13]);

			indexesArray.push([index + 7, index + 15, index + 14]);
			indexesArray.push([index + 14, index + 6, index + 7]);
		}


		// Head

		let index = vertices.length;

		vertices.push([-1, -1, 0]);
		vertices.push([1, -1, 0]);
		vertices.push([1, 1, 0]);
		vertices.push([-1, 1, 0]);

		vertexNormals.push([0, 0, 1]);
		vertexNormals.push([0, 0, 1]);
		vertexNormals.push([0, 0, 1]);
		vertexNormals.push([0, 0, 1]);

		vertexIDs[index] = 0;
		vertexIDs[index + 1] = 0;
		vertexIDs[index + 2] = 0;
		vertexIDs[index + 3] = 0;

		indexesArray.push([index + 2, index + 1, index + 0]);
		indexesArray.push([index + 0, index + 3, index + 2]);

		// Tail
		index = vertices.length;

		vertices.push([-1, -1, 0]);
		vertices.push([1, -1, 0]);
		vertices.push([1, 1, 0]);
		vertices.push([-1, 1, 0]);

		vertexNormals.push([0, 0, -1]);
		vertexNormals.push([0, 0, -1]);
		vertexNormals.push([0, 0, -1]);
		vertexNormals.push([0, 0, -1]);

		vertexIDs[index] = this.pointNumber - 1;
		vertexIDs[index + 1] = this.pointNumber - 1;
		vertexIDs[index + 2] = this.pointNumber - 1;
		vertexIDs[index + 3] = this.pointNumber - 1;

		indexesArray.push([index + 0, index + 1, index + 2]);
		indexesArray.push([index + 2, index + 3, index + 0]);

		let positions = new Float32Array(vertices.length * 3);
		for (let i = 0; i < vertices.length; i++) {
			positions[i * 3 + 0] = vertices[i][0];
			positions[i * 3 + 1] = vertices[i][1];
			positions[i * 3 + 2] = vertices[i][2];
		}
		geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));

		let normals = new Float32Array(vertexNormals.length * 3);
		for (let i = 0; i < vertexNormals.length; i++) {
			normals[i * 3 + 0] = vertexNormals[i][0];
			normals[i * 3 + 1] = vertexNormals[i][1];
			normals[i * 3 + 2] = vertexNormals[i][2];
		}
		geometry.addAttribute("normal", new THREE.BufferAttribute(normals, 3));

		let indexes = new Float32Array(indexesArray.length * 3);
		for (let i = 0; i < indexesArray.length; i++) {
			indexes[i * 3 + 0] = indexesArray[i][0];
			indexes[i * 3 + 1] = indexesArray[i][1];
			indexes[i * 3 + 2] = indexesArray[i][2];
		}
		geometry.addAttribute("id", new THREE.BufferAttribute(vertexIDs, 1));
		geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indexes), 1));

		uniforms = {}
		uniforms.offsetID = { type: "f", value: 0 }
		uniforms.color = { type: "c", value: new THREE.Color(color) }
		uniforms.opacity = { type: "f", value: 1 }
		uniforms.scale = { type: "f", value: 1 }
		uniforms.data = { type: "t", value: TEXTURE }
		uniforms.dataOffset = { type: "f", value: DATA_OFFSET }

		let material = new THREE.RawShaderMaterial({
			uniforms: uniforms,
			vertexShader: vs,
			fragmentShader: fs,
			// side:THREE.DoubleSide,
			depthWrite:false,
			transparent: true,
			blending: THREE.AdditiveBlending
		});

		this.mesh = new THREE.Mesh(geometry, material);
		this.add(this.mesh);

		DATA_OFFSET += this.pointNumber;
	}

	update(position) {
		if(this.debug)this.debug.position.copy(position);
		let dataOffset = this.mesh.material.uniforms.dataOffset.value * 8;

		this._direction.copy(position).sub(this._previousPosition).normalize();

		if (this._time === 0) {
			for (let i = 0; i < this.pointNumber * 8; i += 8) {
				TEXTURE.image.data[i + dataOffset] = position.x;
				TEXTURE.image.data[i + 1 + dataOffset] = position.y;
				TEXTURE.image.data[i + 2 + dataOffset] = position.z;
			}
			this._normal.crossVectors(this._direction, new THREE.Vector3(1, 0, 0)).normalize();
		} else {
			this._normal.crossVectors(this._previousBinormal, this._direction).normalize();
		}

		this._binormal.crossVectors(this._direction, this._normal).normalize();
		let angle = this._normal.angleTo(this._binormal);

		this._matrix4Cached1.set(
			this._normal.x,
			this._binormal.x,
			this._direction.x,
			0,

			this._normal.y,
			this._binormal.y,
			this._direction.y,
			0,

			this._normal.z,
			this._binormal.z,
			this._direction.z,
			0,

			0,
			0,
			0,
			1
		);

		this._eulerCached1.setFromRotationMatrix(this._matrix4Cached1)

		this._time += .1

		let positionDifference = this._vector3Cached1.copy(position).sub(this._previousPosition)

		for (let i = 0; i < this.pointNumber * 8; i += 8) {
			let offset = dataOffset + i;
			TEXTURE.image.data[offset] = TEXTURE.image.data[offset] - positionDifference.x
			TEXTURE.image.data[offset + 1] = TEXTURE.image.data[offset + 1] - positionDifference.y
			TEXTURE.image.data[offset + 2] = TEXTURE.image.data[offset + 2] - positionDifference.z
		}

		TEXTURE.image.data[this._bufferOffset + dataOffset] = 0
		TEXTURE.image.data[this._bufferOffset + 1 + dataOffset] = 0
		TEXTURE.image.data[this._bufferOffset + 2 + dataOffset] = 0
		TEXTURE.image.data[this._bufferOffset + 3 + dataOffset] = this.radius
		TEXTURE.image.data[this._bufferOffset + 4 + dataOffset] = this._eulerCached1.x
		TEXTURE.image.data[this._bufferOffset + 5 + dataOffset] = this._eulerCached1.y
		TEXTURE.image.data[this._bufferOffset + 6 + dataOffset] = this._eulerCached1.z
		TEXTURE.needsUpdate = true

		this.mesh.material.uniforms.offsetID.value += 1
		this.mesh.material.uniforms.offsetID.value %= this.pointNumber
		this.mesh.frustumCulled = false

		this._bufferOffset += 8
		this._bufferOffset %= this.pointNumber * 8

		this._previousBinormal.copy(this._binormal)
		this._previousPosition.copy(position)

		this.position.copy(position)
	}
}

module.exports = CubeLine
