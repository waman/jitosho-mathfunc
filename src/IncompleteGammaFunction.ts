import { logGamma } from "./GammaFunction"

function pGammaNormalizable(a: number, x: number, logGamma_a: number): number {
    if(x >= 1 + a) return 1 - qGammaNormalizable(a, x, logGamma_a);
    if(x === 0)    return 0;

    let result = Math.exp(a * Math.log(x) - x - logGamma_a) / a,
        term   = result;
    for(let k = 1; k < 1000; k++){
        const prev = result;
        term *= x / (a + k);
        result += term;
        if(result === prev) return result;
    }
    return Number.NaN;
} 

function qGammaNormalizable(a: number, x: number, logGamma_a: number): number {
    if(x < 1 + a) return 1 - pGammaNormalizable(a, x, logGamma_a);
    let w = Math.exp(a * Math.log(x) - x - logGamma_a);
    let la = 1, lb = 1 + x - a, result = w / lb;
    for(let k = 2; k < 1000; k++){
        let temp = ((k-1-a)*(lb-la) + (k+x)*lb)/k;
        la = lb; lb = temp;
        w *= (k-1-a)/k;
        temp = w/(la*lb);
        const prev = result;
        result += temp;
        if(result === prev) return result;
    }
    return Number.NaN;
}

//***** incomplete gamma function *****
export function pGamma(a: number, x: number): number {
    return pGammaNormalizable(a, x, logGamma(a));
}

export function qGamma(a: number, x: number): number {
    return qGammaNormalizable(a, x, logGamma(a));
}

//***** chi square distribution *****
export function pChi2(x: number, nFree: number): number {
    return pGamma(0.5*nFree, 0.5*x);
}

export function qChi2(x: number, nFree: number): number {
    return qGamma(0.5*nFree, 0.5*x);
}

/** (log π)/2 */
const LOG_PI_BY2 = Math.log(Math.PI)/2;

//***** Gauss error function *****
export function erf(x: number): number {
    if(x >= 0) return  pGammaNormalizable(0.5, x*x, LOG_PI_BY2);
    else       return -pGammaNormalizable(0.5, x*x, LOG_PI_BY2);
}
/** 1-erf(x) */
export function erfc(x: number): number {
    if(x >= 0) return     qGammaNormalizable(0.5, x*x, LOG_PI_BY2);
    else       return 1 + pGammaNormalizable(0.5, x*x, LOG_PI_BY2);
}

//***** normal distribution *****
export function pNormal(x: number): number {
    if(x >= 0) return 0.5*(1 + pGammaNormalizable(0.5, 0.5*x*x, LOG_PI_BY2));
    else       return 0.5*qGammaNormalizable(0.5, 0.5*x*x, LOG_PI_BY2);
}
export function qNormal(x: number): number {
    if(x >= 0) return 0.5*qGammaNormalizable(0.5, 0.5*x*x, LOG_PI_BY2);
    else       return 0.5*(1 + pGammaNormalizable(0.5, 0.5*x*x, LOG_PI_BY2));
}


