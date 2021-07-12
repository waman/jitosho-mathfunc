import { assert } from "chai"
import { setupMaster } from "cluster";
import { gamma } from "./GammaFunction";
import { chi2CDF, chi2CDFUpper, erf, erfc, igamma, iGamma, normalCDF, normalCDFUpper, pGamma, qGamma } from "./IncompleteGammaFunction";

const epsilon = 1e-7;
const bigValue = 1e10

describe('Gamma function', () => {

    it('should take the following value', () => {
        assert.approximately(gamma(1), 1, epsilon, 'SHOULD Γ(1) = 1');
        assert.approximately(gamma(2), 1, epsilon, 'SHOULD Γ(2) = 1');
        assert.approximately(gamma(3), 2, epsilon, 'SHOULD Γ(3) = 2');
        assert.approximately(gamma(10), 9*8*7*6*5*4*3*2*1, epsilon, 'SHOULD Γ(10) = 9!');

        assert.approximately(gamma(1/2), Math.sqrt(Math.PI), epsilon, 'SHOULD Γ(1/2) = √π');
        assert.approximately(gamma(3/2), Math.sqrt(Math.PI)/2, epsilon, 'SHOULD Γ(3/2) = √π/2');
        assert.approximately(gamma(5/2), 3*Math.sqrt(Math.PI)/4, epsilon, 'SHOULD Γ(5/2) = 3√π/4');

        for(let i = -1; i > -5; i--){
            const y = gamma(i);
            assert(Number.isNaN(y) || Math.abs(y) > bigValue, 'SHOULD Γ(-n) ~ ±∞');
        }
    });
});

function assertTheSameMathFunc(
        f: (x: number) => number, g: (x: number) => number,
        filter = (x: number) => true, additionalMessage = '', varName = 'x', n = 1000, min = -5, max = 5){

    const delta = (max - min)/n;
    let nTested = 0;
    for(let x = min; x < max; x+= delta){
        const xround = Math.round(x*n)/n;
        assertAt(xround);
    }
    for(let i = 0; i < n; i++){
        const xrand = min + (max - min)*Math.random();
        assertAt(xrand);
    }
    if(nTested === 0) throw new Error(`No point is tested`);

    function assertAt(x: number){
        if(filter(x)){
            const yf = f(x), yg = g(x);
            if(!bothAreInfinite(yf, yg) && !bothAreNaN(yf, yg)){
                assert.approximately(yf, yg, Math.abs(yg)*epsilon,
                    `assertion is failed at ${varName} = ${x} (${yg ? Math.abs((yf-yg)/yg)*100 : 0}%) ` +
                        additionalMessage);
                nTested++;
            }
        }
    }

    function bothAreInfinite(x: number, y: number){
        return !Number.isFinite(x) && !Number.isFinite(y);
    }

    function bothAreNaN(x: number, y: number){
        return Number.isNaN(x) && Number.isNaN(y);
    }
}

/**
 * The following tests are 
 * <a href="https://en.m.wikipedia.org/wiki/Incomplete_gamma_function">Incomplete gamma function</a>
 */
describe('Incomplete Gamma functions', () => {

    describe('should satisfy the following relations', () => {
        it('γ(s, x) + Γ(s, x) = Γ(s)', () => {
            for(let i = 0; i < 20; i++){
                const x = Math.random() * 100;  // TODO x < 0
                assertTheSameMathFunc(
                    s => igamma(s, x) + iGamma(s, x), 
                    s => gamma(s), 
                    s => s > 0, `x = ${x}`, 's');
            }
        });

        it('γ(s+1, x) = s*γ(s, x) - x^s*e^{-x}', () => {
            for(let i = 0; i < 20; i++){
                const s = Math.random() * 10;
                assertTheSameMathFunc(
                    x => igamma(s+1, x), 
                    x => s*igamma(s, x) - Math.pow(x, s) * Math.exp(-x),
                    undefined, `s = ${s}`);
            }
        });

        it('Γ(s+1, x) = s*Γ(s, x) + x^s*e^{-x}', () => {
            for(let i = 0; i < 20; i++){
                const s = Math.random() * 10;
                assertTheSameMathFunc(
                    x => iGamma(s+1, x), 
                    x => s*iGamma(s, x) + Math.pow(x, s) * Math.exp(-x),
                    undefined, `s = ${s}`);
            }
        });

        it('γ(1, x) = 1 - e^{-x}', () => {
            assertTheSameMathFunc(
                x => igamma(1, x), 
                x => 1 - Math.exp(-x));
        });

        it('Γ(1, x) = e^{-x}', () => {
            assertTheSameMathFunc(
                x => iGamma(1, x), 
                x => Math.exp(-x));
        });

        it('Γ(s, 0) = Γ(s)', () => {
            assertTheSameMathFunc(
                s => iGamma(s, 0), 
                s => gamma(s), s => s > 0, undefined, 's');
        });

        it('Γ(s+1, 1) = [e*s!]/e', () => {
            let ss = 1
            for(let s = 1; s < 20; s++){
                ss *= s;
                const sut = iGamma(s+1, 1);
                assert.approximately(sut, Math.floor(Math.E * ss) / Math.E, sut*epsilon);
            }
        });

        it('Γ(s, x) = (s-1)!e^{-x}sum_0^{s-1}x^k/k!', () => {
            let ss = 1
            for(let s = 1; s < 10; s++){
                ss *= s;
                assertTheSameMathFunc(
                    x => iGamma(s, x),
                    x => {
                        let sum = 0, kk = 1;
                        for(let k = 0; k < s; k++){
                            if(k !== 0) kk *= k;
                            sum += Math.pow(x, k) / kk;
                        }
                        return ss/s * Math.exp(-x) * sum;
                    },
                    undefined, `s = ${s}`);
            }
        });
    });
});

describe('Regularized Gamma functions', () => {

    describe('should satisfy the following relations', () => {
        it('P(s, x) = γ(s, x)/Γ(s)', () => {
            for(let i = 0; i < 10; i++){
                const s = Math.random() * 100;
                assertTheSameMathFunc(
                    x => pGamma(s, x), 
                    x => igamma(s, x) / gamma(s), 
                    undefined, `s = ${s}`);
            }
        });

        it('Q(s, x) = Γ(s, x)/Γ(s)', () => {
            for(let i = 0; i < 10; i++){
                const s = Math.random() * 100;
                assertTheSameMathFunc(
                    x => qGamma(s, x), 
                    x => iGamma(s, x) / gamma(s), 
                    undefined, `s = ${s}`);
            }
        });
    });
});

describe('Error functions', () => {
    const SQRT_PI_INV = 1/Math.sqrt(Math.PI);

    describe('should satisfy the following relations', () => {
        it('erfc(x) = 1 - erf(x)', () => {
            assertTheSameMathFunc(
                x => erfc(x), 
                x => 1 - erf(x), undefined, undefined, undefined, undefined, -3, 3);
        });

        it('erf(x) = sgn(x)γ(1/2, x^2)/√π', () => {
            assertTheSameMathFunc(
                x => erf(x), 
                x => Math.sign(x) * igamma(1/2, x*x) * SQRT_PI_INV);
        });

        it('erfc(x) = Γ(1/2, x^2)/√π', () => {
            assertTheSameMathFunc(
                x => erfc(x), 
                x => iGamma(1/2, x*x) * SQRT_PI_INV,
                x => x >= 0);
        });
    });
});

describe('CDFs of the normal distribution', () => {

    describe('should satisfy the following relations', () => {
        it('normalCDFUpper(x) = 1 - normalCDF(x)', () => {
            assertTheSameMathFunc(
                x => normalCDFUpper(x), 
                x => 1 - normalCDF(x));
        });

        it('normalCDF(x) = (1 + erf(x/√2))/2', () => {
            assertTheSameMathFunc(
                x => normalCDF(x), 
                x => (1 + erf(x*Math.SQRT1_2))/2);
        });
    });
});

describe('CDFs of the chi-square distribution', () => {

    describe('should satisfy the following relations', () => {

        it('chi2CDFUpper(x) = 1 - chi2CDF(x)', () => {
            for(let k = 1; k < 10; k++){
                assertTheSameMathFunc(
                    x => chi2CDFUpper(k, x), 
                    x => 1 - chi2CDF(k, x),
                    undefined, `degree of feedom = ${k}`);
            }
        });

        it('chi2CDF(x, k) = γ(k/2, x/2)/Γ(k/2)', () => {
            for(let k = 1; k < 10; k++){
                assertTheSameMathFunc(
                    x => chi2CDF(k, x), 
                    x => pGamma(k/2, x/2),
                    x => x > 0, `degree of feedom = ${k}`);
            }
        });
    });
});