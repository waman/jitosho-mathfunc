import { assert } from "chai"
import { gamma } from "./GammaFunction";

describe('Gamma function', () => {
    const delta = 1e-8;

    it('should take the following value', () => {
        assert.approximately(gamma(1), 1, delta, 'Γ(1) = 1');
        assert.approximately(gamma(2), 1, delta, 'Γ(2) = 1');
        assert.approximately(gamma(3), 2, delta, 'Γ(3) = 2');
        assert.approximately(gamma(10), 9*8*7*6*5*4*3*2*1, delta, 'Γ(10) = 9!');

        assert.approximately(gamma(1/2), Math.sqrt(Math.PI), delta, 'Γ(1/2) = √π');
        assert.approximately(gamma(3/2), Math.sqrt(Math.PI)/2, delta, 'Γ(3/2) = √π/2');
        assert.approximately(gamma(5/2), 3*Math.sqrt(Math.PI)/4, delta, 'Γ(5/2) = 3√π/4');

        for(let i = -1; i > -5; i--){
            const y = gamma(i);
            assert(y === NaN || y < -1e10 || 1e10 < y, 'Γ(-n) ~ ±∞');
        }
    })
})