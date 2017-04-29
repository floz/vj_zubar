
const random = require( "mnf/utils/random" )

/*! simplex-noise.js: copyright 2012 Jonas Wagner, licensed under a MIT license. See https://github.com/jwagner/simplex-noise.js for details */
function SimplexNoise(random) {
    random || (random = Math.random), this.p = new Uint8Array(256), this.perm = new Uint8Array(512), this.permMod12 = new Uint8Array(512);
    for (var i = 0; 256 > i; i++) this.p[i] = 256 * random();
    for (i = 0; 512 > i; i++) this.perm[i] = this.p[255 & i], this.permMod12[i] = this.perm[i] % 12
}
var F2 = .5 * (Math.sqrt(3) - 1),
    G2 = (3 - Math.sqrt(3)) / 6,
    F3 = 1 / 3,
    G3 = 1 / 6,
    F4 = (Math.sqrt(5) - 1) / 4,
    G4 = (5 - Math.sqrt(5)) / 20;
SimplexNoise.prototype = {
    grad3: new Float32Array([1, 1, 0, - 1, 1, 0, 1, - 1, 0, - 1, - 1, 0, 1, 0, 1, - 1, 0, 1, 1, 0, - 1, - 1, 0, - 1, 0, 1, 1, 0, - 1, 1, 0, 1, - 1, 0, - 1, - 1]),
    grad4: new Float32Array([0, 1, 1, 1, 0, 1, 1, - 1, 0, 1, - 1, 1, 0, 1, - 1, - 1, 0, - 1, 1, 1, 0, - 1, 1, - 1, 0, - 1, - 1, 1, 0, - 1, - 1, - 1, 1, 0, 1, 1, 1, 0, 1, - 1, 1, 0, - 1, 1, 1, 0, - 1, - 1, - 1, 0, 1, 1, - 1, 0, 1, - 1, - 1, 0, - 1, 1, - 1, 0, - 1, - 1, 1, 1, 0, 1, 1, 1, 0, - 1, 1, - 1, 0, 1, 1, - 1, 0, - 1, - 1, 1, 0, 1, - 1, 1, 0, - 1, - 1, - 1, 0, 1, - 1, - 1, 0, - 1, 1, 1, 1, 0, 1, 1, - 1, 0, 1, - 1, 1, 0, 1, - 1, - 1, 0, - 1, 1, 1, 0, - 1, 1, - 1, 0, - 1, - 1, 1, 0, - 1, - 1, - 1, 0]),
    noise2D: function(xin, yin) {
        var i1, j1, permMod12 = this.permMod12,
            perm = this.perm,
            grad3 = this.grad3,
            n0 = 0,
            n1 = 0,
            n2 = 0,
            s = (xin + yin) * F2,
            i = Math.floor(xin + s),
            j = Math.floor(yin + s),
            t = (i + j) * G2,
            X0 = i - t,
            Y0 = j - t,
            x0 = xin - X0,
            y0 = yin - Y0;
        x0 > y0 ? (i1 = 1, j1 = 0) : (i1 = 0, j1 = 1);
        var x1 = x0 - i1 + G2,
            y1 = y0 - j1 + G2,
            x2 = x0 - 1 + 2 * G2,
            y2 = y0 - 1 + 2 * G2,
            ii = 255 & i,
            jj = 255 & j,
            t0 = .5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
            var gi0 = 3 * permMod12[ii + perm[jj]];
            t0 *= t0, n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0)
        }
        var t1 = .5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
            var gi1 = 3 * permMod12[ii + i1 + perm[jj + j1]];
            t1 *= t1, n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1)
        }
        var t2 = .5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
            var gi2 = 3 * permMod12[ii + 1 + perm[jj + 1]];
            t2 *= t2, n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2)
        }
        return 70 * (n0 + n1 + n2)
    },
    noise3D: function(xin, yin, zin) {
        var n0, n1, n2, n3, i1, j1, k1, i2, j2, k2, permMod12 = this.permMod12,
            perm = this.perm,
            grad3 = this.grad3,
            s = (xin + yin + zin) * F3,
            i = Math.floor(xin + s),
            j = Math.floor(yin + s),
            k = Math.floor(zin + s),
            t = (i + j + k) * G3,
            X0 = i - t,
            Y0 = j - t,
            Z0 = k - t,
            x0 = xin - X0,
            y0 = yin - Y0,
            z0 = zin - Z0;
        x0 >= y0 ? y0 >= z0 ? (i1 = 1, j1 = 0, k1 = 0, i2 = 1, j2 = 1, k2 = 0) : x0 >= z0 ? (i1 = 1, j1 = 0, k1 = 0, i2 = 1, j2 = 0, k2 = 1) : (i1 = 0, j1 = 0, k1 = 1, i2 = 1, j2 = 0, k2 = 1) : z0 > y0 ? (i1 = 0, j1 = 0, k1 = 1, i2 = 0, j2 = 1, k2 = 1) : z0 > x0 ? (i1 = 0, j1 = 1, k1 = 0, i2 = 0, j2 = 1, k2 = 1) : (i1 = 0, j1 = 1, k1 = 0, i2 = 1, j2 = 1, k2 = 0);
        var x1 = x0 - i1 + G3,
            y1 = y0 - j1 + G3,
            z1 = z0 - k1 + G3,
            x2 = x0 - i2 + 2 * G3,
            y2 = y0 - j2 + 2 * G3,
            z2 = z0 - k2 + 2 * G3,
            x3 = x0 - 1 + 3 * G3,
            y3 = y0 - 1 + 3 * G3,
            z3 = z0 - 1 + 3 * G3,
            ii = 255 & i,
            jj = 255 & j,
            kk = 255 & k,
            t0 = .6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (0 > t0) n0 = 0;
        else {
            var gi0 = 3 * permMod12[ii + perm[jj + perm[kk]]];
            t0 *= t0, n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0)
        }
        var t1 = .6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (0 > t1) n1 = 0;
        else {
            var gi1 = 3 * permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]];
            t1 *= t1, n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1)
        }
        var t2 = .6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (0 > t2) n2 = 0;
        else {
            var gi2 = 3 * permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]];
            t2 *= t2, n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2)
        }
        var t3 = .6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (0 > t3) n3 = 0;
        else {
            var gi3 = 3 * permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]];
            t3 *= t3, n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3)
        }
        return 32 * (n0 + n1 + n2 + n3)
    },
    noise4D: function(x, y, z, w) {
        var n0, n1, n2, n3, n4, perm = (this.permMod12, this.perm),
            grad4 = this.grad4,
            s = (x + y + z + w) * F4,
            i = Math.floor(x + s),
            j = Math.floor(y + s),
            k = Math.floor(z + s),
            l = Math.floor(w + s),
            t = (i + j + k + l) * G4,
            X0 = i - t,
            Y0 = j - t,
            Z0 = k - t,
            W0 = l - t,
            x0 = x - X0,
            y0 = y - Y0,
            z0 = z - Z0,
            w0 = w - W0,
            rankx = 0,
            ranky = 0,
            rankz = 0,
            rankw = 0;
        x0 > y0 ? rankx++ : ranky++, x0 > z0 ? rankx++ : rankz++, x0 > w0 ? rankx++ : rankw++, y0 > z0 ? ranky++ : rankz++, y0 > w0 ? ranky++ : rankw++, z0 > w0 ? rankz++ : rankw++;
        var i1, j1, k1, l1, i2, j2, k2, l2, i3, j3, k3, l3;
        i1 = rankx >= 3 ? 1 : 0, j1 = ranky >= 3 ? 1 : 0, k1 = rankz >= 3 ? 1 : 0, l1 = rankw >= 3 ? 1 : 0, i2 = rankx >= 2 ? 1 : 0, j2 = ranky >= 2 ? 1 : 0, k2 = rankz >= 2 ? 1 : 0, l2 = rankw >= 2 ? 1 : 0, i3 = rankx >= 1 ? 1 : 0, j3 = ranky >= 1 ? 1 : 0, k3 = rankz >= 1 ? 1 : 0, l3 = rankw >= 1 ? 1 : 0;
        var x1 = x0 - i1 + G4,
            y1 = y0 - j1 + G4,
            z1 = z0 - k1 + G4,
            w1 = w0 - l1 + G4,
            x2 = x0 - i2 + 2 * G4,
            y2 = y0 - j2 + 2 * G4,
            z2 = z0 - k2 + 2 * G4,
            w2 = w0 - l2 + 2 * G4,
            x3 = x0 - i3 + 3 * G4,
            y3 = y0 - j3 + 3 * G4,
            z3 = z0 - k3 + 3 * G4,
            w3 = w0 - l3 + 3 * G4,
            x4 = x0 - 1 + 4 * G4,
            y4 = y0 - 1 + 4 * G4,
            z4 = z0 - 1 + 4 * G4,
            w4 = w0 - 1 + 4 * G4,
            ii = 255 & i,
            jj = 255 & j,
            kk = 255 & k,
            ll = 255 & l,
            t0 = .6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
        if (0 > t0) n0 = 0;
        else {
            var gi0 = perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32 * 4;
            t0 *= t0, n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0)
        }
        var t1 = .6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
        if (0 > t1) n1 = 0;
        else {
            var gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32 * 4;
            t1 *= t1, n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1)
        }
        var t2 = .6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
        if (0 > t2) n2 = 0;
        else {
            var gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32 * 4;
            t2 *= t2, n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2)
        }
        var t3 = .6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
        if (0 > t3) n3 = 0;
        else {
            var gi3 = perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32 * 4;
            t3 *= t3, n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3)
        }
        var t4 = .6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
        if (0 > t4) n4 = 0;
        else {
            var gi4 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32 * 4;
            t4 *= t4, n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4)
        }
        return 27 * (n0 + n1 + n2 + n3 + n4)
    }
}

module.exports.SimplexNoise = SimplexNoise



/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */


var noisePerlin = {};

function Grad(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

Grad.prototype.dot2 = function(x, y) {
  return this.x * x + this.y * y;
};

Grad.prototype.dot3 = function(x, y, z) {
  return this.x * x + this.y * y + this.z * z;
};

var grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, - 1, 0), new Grad(-1, - 1, 0),
new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, - 1), new Grad(-1, 0, - 1),
new Grad(0, 1, 1), new Grad(0, - 1, 1), new Grad(0, 1, - 1), new Grad(0, - 1, - 1)];

var p = [151, 160, 137, 91, 90, 15,
131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
// To remove the need for index wrapping, double the permutation table length
var perm = new Array(512);
var gradP = new Array(512);

// This isn't a very good seeding function, but it works ok. It supports 2^16
// different seed values. Write something better if you need more seeds.
noisePerlin.seed = function(seed) {
  if (seed > 0 && seed < 1) {
      // Scale the seed out
      seed *= 65536;
  }

  seed = Math.floor(seed);
  if (seed < 256) {
      seed |= seed << 8;
  }

  for (var i = 0; i < 256; i++) {
      var v;
      if (i & 1) {
          v = p[i] ^ (seed & 255);
      } else {
          v = p[i] ^ ((seed >> 8) & 255);
      }

      perm[i] = perm[i + 256] = v;
      gradP[i] = gradP[i + 256] = grad3[v % 12];
  }
};

noisePerlin.seed(0);

/*
for(var i=0; i<256; i++) {
perm[i] = perm[i + 256] = p[i];
gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
}*/

// Skewing and unskewing factors for 2, 3, and 4 dimensions
var F2 = 0.5 * (Math.sqrt(3) - 1);
var G2 = (3 - Math.sqrt(3)) / 6;

var F3 = 1 / 3;
var G3 = 1 / 6;

// 2D simplex noise
noisePerlin.simplex2 = function(xin, yin) {
  var n0, n1, n2; // Noise contributions from the three corners
  // Skew the input space to determine which simplex cell we're in
  var s = (xin + yin) * F2; // Hairy factor for 2D
  var i = Math.floor(xin + s);
  var j = Math.floor(yin + s);
  var t = (i + j) * G2;
  var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
  var y0 = yin - j + t;
  // For the 2D case, the simplex shape is an equilateral triangle.
  // Determine which simplex we are in.
  var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
  if (x0 > y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      i1 = 1;
      j1 = 0;
  } else { // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      i1 = 0;
      j1 = 1;
  }
  // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
  // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
  // c = (3-sqrt(3))/6
  var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
  var y1 = y0 - j1 + G2;
  var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
  var y2 = y0 - 1 + 2 * G2;
  // Work out the hashed gradient indices of the three simplex corners
  i &= 255;
  j &= 255;
  var gi0 = gradP[i + perm[j]];
  var gi1 = gradP[i + i1 + perm[j + j1]];
  var gi2 = gradP[i + 1 + perm[j + 1]];
  // Calculate the contribution from the three corners
  var t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 < 0) {
      n0 = 0;
  } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot2(x0, y0); // (x,y) of grad3 used for 2D gradient
  }
  var t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 < 0) {
      n1 = 0;
  } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot2(x1, y1);
  }
  var t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 < 0) {
      n2 = 0;
  } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot2(x2, y2);
  }
  // Add contributions from each corner to get the final noise value.
  // The result is scaled to return values in the interval [-1,1].
  return 70 * (n0 + n1 + n2);
};

// 3D simplex noise
noisePerlin.simplex3 = function(xin, yin, zin) {
  var n0, n1, n2, n3; // Noise contributions from the four corners

  // Skew the input space to determine which simplex cell we're in
  var s = (xin + yin + zin) * F3; // Hairy factor for 2D
  var i = Math.floor(xin + s);
  var j = Math.floor(yin + s);
  var k = Math.floor(zin + s);

  var t = (i + j + k) * G3;
  var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
  var y0 = yin - j + t;
  var z0 = zin - k + t;

  // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
  // Determine which simplex we are in.
  var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
  var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
  if (x0 >= y0) {
      if (y0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 1;
          k2 = 0;
      } else if (x0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 0;
          k2 = 1;
      } else {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 1;
          j2 = 0;
          k2 = 1;
      }
  } else {
      if (y0 < z0) {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 0;
          j2 = 1;
          k2 = 1;
      } else if (x0 < z0) {
          i1 = 0;
          j1 = 1;
          k1 = 0;
          i2 = 0;
          j2 = 1;
          k2 = 1;
      } else {
          i1 = 0;
          j1 = 1;
          k1 = 0;
          i2 = 1;
          j2 = 1;
          k2 = 0;
      }
  }
  // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
  // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
  // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
  // c = 1/6.
  var x1 = x0 - i1 + G3; // Offsets for second corner
  var y1 = y0 - j1 + G3;
  var z1 = z0 - k1 + G3;

  var x2 = x0 - i2 + 2 * G3; // Offsets for third corner
  var y2 = y0 - j2 + 2 * G3;
  var z2 = z0 - k2 + 2 * G3;

  var x3 = x0 - 1 + 3 * G3; // Offsets for fourth corner
  var y3 = y0 - 1 + 3 * G3;
  var z3 = z0 - 1 + 3 * G3;

  // Work out the hashed gradient indices of the four simplex corners
  i &= 255;
  j &= 255;
  k &= 255;
  var gi0 = gradP[i + perm[j + perm[k]]];
  var gi1 = gradP[i + i1 + perm[j + j1 + perm[k + k1]]];
  var gi2 = gradP[i + i2 + perm[j + j2 + perm[k + k2]]];
  var gi3 = gradP[i + 1 + perm[j + 1 + perm[k + 1]]];

  // Calculate the contribution from the four corners
  var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
  if (t0 < 0) {
      n0 = 0;
  } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot3(x0, y0, z0); // (x,y) of grad3 used for 2D gradient
  }
  var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
  if (t1 < 0) {
      n1 = 0;
  } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
  }
  var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
  if (t2 < 0) {
      n2 = 0;
  } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
  }
  var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
  if (t3 < 0) {
      n3 = 0;
  } else {
      t3 *= t3;
      n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
  }
  // Add contributions from each corner to get the final noise value.
  // The result is scaled to return values in the interval [-1,1].
  return 32 * (n0 + n1 + n2 + n3);

};

// ##### Perlin noise stuff

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a, b, t) {
  return (1 - t) * a + t * b;
}

// 2D Perlin Noise
noisePerlin.perlin2 = function(x, y) {
  // Find unit grid cell containing point
  var X = Math.floor(x),
      Y = Math.floor(y);
  // Get relative xy coordinates of point within that cell
  x = x - X;
  y = y - Y;
  // Wrap the integer cells at 255 (smaller integer period can be introduced here)
  X = X & 255;
  Y = Y & 255;

  // Calculate noise contributions from each of the four corners
  var n00 = gradP[X + perm[Y]].dot2(x, y);
  var n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1);
  var n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y);
  var n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1);

  // Compute the fade curve value for x
  var u = fade(x);

  // Interpolate the four results
  return lerp(
  lerp(n00, n10, u),
  lerp(n01, n11, u),
  fade(y));
};

// 3D Perlin Noise
noisePerlin.perlin3 = function(x, y, z) {
  // Find unit grid cell containing point
  var X = Math.floor(x),
      Y = Math.floor(y),
      Z = Math.floor(z);
  // Get relative xyz coordinates of point within that cell
  x = x - X;
  y = y - Y;
  z = z - Z;
  // Wrap the integer cells at 255 (smaller integer period can be introduced here)
  X = X & 255;
  Y = Y & 255;
  Z = Z & 255;

  // Calculate noise contributions from each of the eight corners
  var n000 = gradP[X + perm[Y + perm[Z]]].dot3(x, y, z);
  var n001 = gradP[X + perm[Y + perm[Z + 1]]].dot3(x, y, z - 1);
  var n010 = gradP[X + perm[Y + 1 + perm[Z]]].dot3(x, y - 1, z);
  var n011 = gradP[X + perm[Y + 1 + perm[Z + 1]]].dot3(x, y - 1, z - 1);
  var n100 = gradP[X + 1 + perm[Y + perm[Z]]].dot3(x - 1, y, z);
  var n101 = gradP[X + 1 + perm[Y + perm[Z + 1]]].dot3(x - 1, y, z - 1);
  var n110 = gradP[X + 1 + perm[Y + 1 + perm[Z]]].dot3(x - 1, y - 1, z);
  var n111 = gradP[X + 1 + perm[Y + 1 + perm[Z + 1]]].dot3(x - 1, y - 1, z - 1);

  // Compute the fade curve value for x, y, z
  var u = fade(x);
  var v = fade(y);
  var w = fade(z);

  // Interpolate
  return lerp(
  lerp(
  lerp(n000, n100, u),
  lerp(n001, n101, u), w),
  lerp(
  lerp(n010, n110, u),
  lerp(n011, n111, u), w),
  v);
};

const e = .1
const divisor = 1.0 / ( 2.0 * e )
const snoiseVec3 = function( x, y, z ){
  return new THREE.Vector3(
	  noisePerlin.simplex3(x, y, z),
	  noisePerlin.simplex3(y - 19.1 , z + 33.4 , x + 47.2),
	  noisePerlin.simplex3(z + 74.2 , x - 124.5 , y + 99.4)
  )
}

const curlNoise3D =
module.exports.curlNoise3D = function( p ){
  let p_x0 = snoiseVec3( p.x - e, p.y, p.z );
  let p_x1 = snoiseVec3( p.x + e, p.y, p.z );
  let p_y0 = snoiseVec3( p.x, p.y + e, p.z );
  let p_y1 = snoiseVec3( p.x, p.y + e, p.z );
  let p_z0 = snoiseVec3( p.x, p.y, p.z - e );
  let p_z1 = snoiseVec3( p.x, p.y, p.z + e );
  return new THREE.Vector3(
	  (p_y1.z - p_y0.z - p_z1.y + p_z0.y)*divisor,
	  ( p_z1.x - p_z0.x - p_x1.z + p_x0.z)*divisor,
	  (p_x1.y - p_x0.y - p_y1.x + p_y0.x)*divisor
  ).normalize()
}

let noise = null

function getNoise() {
  if( noise == null ) {
	  noise = new SimplexNoise( random )
  }
  return noise
}

module.exports = getNoise()

module.exports.generate = ( rnd ) => {
  noise = new SimplexNoise( rnd )
}
