import { logGamma } from "./GammaFunction"

/**
 * Return a value of the the regularized Gamma function.
 * The normalization factor can be manually specified by the last argument.
 * 
 * Ref: 『Javaによるアルゴリズム事典』不完全ガンマ関数 (incomplete gamma function) Igamma.java
 */
function pGammaNormalizable(s: number, x: number, logGamma_s: number): number {
    if(x >= 1 + s) return 1 - qGammaNormalizable(s, x, logGamma_s);
    if(x === 0)    return 0;

    let result = Math.pow(x, s) * Math.exp(-x - logGamma_s) / s,
    // let result = Math.exp(s * Math.log(x) - x - logGamma_s) / s,
        term   = result;
    for(let k = 1; k < 1000; k++){
        const prev = result;
        term *= x / (s + k);
        result += term;
        if(result === prev) return result;
    }
    return NaN;
} 

/**
 * Return a value of the upper incomplete gamma function.
 * The normalization factor can be manually specified by the last argument.
 * 
 * Ref: 『Javaによるアルゴリズム事典』不完全ガンマ関数 (incomplete gamma function) Igamma.java
 */
function qGammaNormalizable(s: number, x: number, logGamma_s: number): number {
    if(x < 1 + s) return 1 - pGammaNormalizable(s, x, logGamma_s);

    let w = Math.pow(x, s) * Math.exp(-x - logGamma_s);
    // let w = Math.exp(s * Math.log(x) - x - logGamma_s);
    let la = 1, lb = 1 + x - s, result = w / lb;
    for(let k = 2; k < 1000; k++){
        let temp = ((k-1-s)*(lb-la) + (k+x)*lb)/k;
        la = lb; lb = temp;
        w *= (k-1-s)/k;
        temp = w/(la*lb);
        const prev = result;
        result += temp;
        if(result === prev) return result;
    }
    return NaN;
}

//***** incomplete gamma function *****
/**
 * Return a value of the lower incomplete gamma function *γ(s, x)*.
 */
export function igamma(s: number, x: number): number {
    const logGamma_s = logGamma(s);
    return Math.exp(logGamma_s) * pGammaNormalizable(s, x, logGamma_s);
}

/**
 * Return a value of the upper incomplete gamma function *Γ(s, x)* = Γ(s) - γ(s, x).
 */
export function iGamma(s: number, x: number): number {
    const logGamma_s = logGamma(s);
    return Math.exp(logGamma_s) * qGammaNormalizable(s, x, logGamma_s);
}

/**
 * Return a value of the regularized Gamma function *P(s, x)* = γ(s, x)/Γ(s).
 */
export function pGamma(s: number, x: number): number {
    return pGammaNormalizable(s, x, logGamma(s));
}

/**
 * Return a value of the regularized Gamma function *Q(s, x)* = Γ(s, x)/Γ(s).
 */
export function qGamma(s: number, x: number): number {
    return qGammaNormalizable(s, x, logGamma(s));
}

/** (1/2)log π */
const LOG_PI_BY2 = Math.log(Math.PI)/2;

//***** Gauss error function *****
/**
 * Return a value of the (Gauss) error function.
 * 
 * Ref: 『Javaによるアルゴリズム事典』不完全ガンマ関数 (incomplete gamma function) Igamma.java
 */
export function erf(x: number): number {
    if(x >= 0) return  pGammaNormalizable(0.5, x*x, LOG_PI_BY2);
    else       return -pGammaNormalizable(0.5, x*x, LOG_PI_BY2);
}

/**
 * Return a value of the complementary error function (= 1 - erf(x)).
 * 
 * Ref: 『Javaによるアルゴリズム事典』不完全ガンマ関数 (incomplete gamma function) Igamma.java
 */
export function erfc(x: number): number {
    if(x >= 0) return     qGammaNormalizable(0.5, x*x, LOG_PI_BY2);
    else       return 1 + pGammaNormalizable(0.5, x*x, LOG_PI_BY2);
}

//***** normal distribution *****
/**
 * Return a value of the lower CDF (cumulative distribution function) of the normal distribution.
 * 
 * Ref: 『Javaによるアルゴリズム事典』不完全ガンマ関数 (incomplete gamma function) Igamma.java
 */
export function normalCDF(x: number): number {
    if(x >= 0) return 0.5*(1 + pGammaNormalizable(0.5, 0.5*x*x, LOG_PI_BY2));
    else       return 0.5*qGammaNormalizable(0.5, 0.5*x*x, LOG_PI_BY2);
}

/**
 * Return a value of the upper PDF of the normal distribution.
 * 
 * Ref: 『Javaによるアルゴリズム事典』不完全ガンマ関数 (incomplete gamma function) Igamma.java
 */
export function normalCDFUpper(x: number): number {
    if(x >= 0) return 0.5*qGammaNormalizable(0.5, 0.5*x*x, LOG_PI_BY2);
    else       return 0.5*(1 + pGammaNormalizable(0.5, 0.5*x*x, LOG_PI_BY2));
}

//***** chi square distribution *****
/**
 * Return a value of the lower CDF (cumulative distribution function) of the chi-square distribution.
 * 
 * Ref: 『Javaによるアルゴリズム事典』不完全ガンマ関数 (incomplete gamma function) Igamma.java
 */
 export function chi2CDF(nFree: number, x: number): number {
    return pGamma(0.5*nFree, 0.5*x);
}

/**
 * Return a value of the upper CDF of the chi-square distribution.
 * 
 * Ref: 『Javaによるアルゴリズム事典』不完全ガンマ関数 (incomplete gamma function) Igamma.java
 */
export function chi2CDFUpper(nFree: number, x: number): number {
    return qGamma(0.5*nFree, 0.5*x);
}

