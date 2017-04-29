
// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

function XorGen(seed) {
    var me = this;

    // Set up generator function.
    me.next = function() {
        var w = me.w,
            X = me.X,
            i = me.i,
            t, v;
        // Update Weyl generator.
        me.w = w = (w + 0x61c88647) | 0;
        // Update xor generator.
        v = X[(i + 34) & 127];
        t = X[i = ((i + 1) & 127)];
        v ^= v << 13;
        t ^= t << 17;
        v ^= v >>> 15;
        t ^= t >>> 12;
        // Update Xor generator array state.
        v = X[i] = v ^ t;
        me.i = i;
        // Result is the combination.
        return (v + (w ^ (w >>> 16))) | 0;
    };

    function init(me, seed) {
        var t, v, i, j, w, X = [],
            limit = 128;
        if (seed === (seed | 0)) {
            // Numeric seeds initialize v, which is used to generates X.
            v = seed;
            seed = null;
        } else {
            // String seeds are mixed into v and X one character at a time.
            seed = seed + '\0';
            v = 0;
            limit = Math.max(limit, seed.length);
        }
        // Initialize circular array and weyl value.
        for (i = 0, j = -32; j < limit; ++j) {
            // Put the unicode characters into the array, and shuffle them.
            if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
            // After 32 shuffles, take v as the starting w value.
            if (j === 0) w = v;
            v ^= v << 10;
            v ^= v >>> 15;
            v ^= v << 4;
            v ^= v >>> 13;
            if (j >= 0) {
                w = (w + 0x61c88647) | 0; // Weyl.
                t = (X[j & 127] ^= (v + w)); // Combine xor and weyl to init array.
                i = (0 == t) ? i + 1 : 0; // Count zeroes.
            }
        }
        // We have detected all zeroes; make the key nonzero.
        if (i >= 128) {
            X[(seed && seed.length || 0) & 127] = -1;
        }
        // Run the generator 512 times to further mix the state before using it.
        // Factoring this as a function slows the main generator, so it is just
        // unrolled here.  The weyl generator is not advanced while warming up.
        i = 127;
        for (j = 4 * 128; j > 0; --j) {
            v = X[(i + 34) & 127];
            t = X[i = ((i + 1) & 127)];
            v ^= v << 13;
            t ^= t << 17;
            v ^= v >>> 15;
            t ^= t >>> 12;
            X[i] = v ^ t;
        }
        // Storing state as object members is faster than using closure variables.
        me.w = w;
        me.X = X;
        me.i = i;
    }

    init(me, seed);
}

function copy(f, t) {
    t.i = f.i;
    t.w = f.w;
    t.X = f.X.slice();
    return t;
};

function impl(seed, opts) {
    if (seed == null) seed = +(new Date);
    var xg = new XorGen(seed),
        state = opts && opts.state,
        prng = function() {
            return (xg.next() >>> 0) / 0x100000000;
        };
    prng.double = function() {
        do {
            var top = xg.next() >>> 11,
                bot = (xg.next() >>> 0) / 0x100000000,
                result = (top + bot) / (1 << 21);
        } while (result === 0);
        return result;
    };
    prng.int32 = xg.next;
    prng.quick = prng;
    if (state) {
        if (state.X) copy(state, xg);
        prng.state = function() {
            return copy(xg, {});
        }
    }
    return prng;
}


const xor =
module.exports.xor = impl

let randomUniq = xor( "makioandfloz" )

function getRandom() {
  return randomUniq
}

module.exports = getRandom()

module.exports.regenerate = ( key ) => {
  random = xor( key )
}

module.exports.between = function(min,max){
	return min+randomUniq()*(max-min)
}

module.exports.choice = function(choice1,choice2){
	return randomUniq()<.5?choice1:choice2
}

module.exports.shuffleArrayBy3 = function(array){
	const l = array.length/3
	for( let k = 0; k < l; k++){
		let i = k*3
		let j = Math.floor(randomUniq() * l)*3

		let temp = array[i]
		array[i] = array[j]
		array[j] = temp

		temp = array[i+1]
		array[i+1] = array[j+1]
		array[j+1] = temp

		temp = array[i+2]
		array[i+2] = array[j+2]
		array[j+2] = temp
	}
	return array
}
