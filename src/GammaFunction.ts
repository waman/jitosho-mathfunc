/** (1/2)log(2π) */
const LOG_2PI_BY2 = Math.log(2 * Math.PI) / 2;

const N = 8;

// Bernoulli numbers
// const B0 = 1;
// const B1 = -1/2;
const B2 = 1/6;
const B4 = -1/30;
const B6 = 1/42;
const B8 = -1/30;
const B10 = 5/66;
const B12 = -691/2730;
const B14 = 7/6;
const B16 = -3617/510;

/**
 * Return a logarithm value of the gamma function.
 * (The argument *x* must be positive.)
 * 
 * Ref: 『Javaによるアルゴリズム事典』ガンマ関数 (gamma function) Gamma.java
 * 　　　『改訂新版 Cによる標準アルゴリズム事典』ガンマ関数 (gamma function) gamma.c
 */
export function logGamma(x: number): number {
    let t = x, v = 1;
    while(t < N){ v *= t; t++; }  // if v is negative, result become NaN.
    const w = 1/(t*t);
    return ((((((((B16 / (16 * 15))  * w + (B14 / (14 * 13))) * w
                + (B12 / (12 * 11))) * w + (B10 / (10 *  9))) * w
                + (B8  / ( 8 *  7))) * w + (B6  / ( 6 *  5))) * w
                + (B4  / ( 4 *  3))) * w + (B2  / ( 2 *  1))) / t
                + LOG_2PI_BY2 - Math.log(v) - t + (t - 0.5) * Math.log(t);
    // let ret =       B16 / (16 * 15);
    // ret = ret * w + B14 / (14 * 13);
    // ret = ret * w + B12 / (12 * 11);
    // ret = ret * w + B10 / (10 *  9);
    // ret = ret * w + B8  / ( 8 *  7);
    // ret = ret * w + B6  / ( 6 *  5);
    // ret = ret * w + B4  / ( 4 *  3);
    // ret = ret * w + B2  / ( 2 *  1);
    // ret = ret / t + 0.5 * LOG_2PI - Math.log(v) - t + (t - 0.5) * Math.log(t);
    // return ret;
}

/**
 * Return a value of the gamma function.
 */
export function gamma(x: number): number {
    if(x >= 0)
        return Math.exp(logGamma(x));
    else
        return Math.PI / (Math.sin(Math.PI * x) * Math.exp(logGamma(1 - x)));
}

/**
 * Return a value of the beta function.
 * 
 * Ref: 『Javaによるアルゴリズム事典』ベータ関数 (beta function) Beta.java
 */
export function beta(x: number, y: number): number {
    if(x >= 0 && y >= 0)
        return Math.exp(logGamma(x) + logGamma(y) - logGamma(x+y));
    else
        return gamma(x)*gamma(y)/gamma(x+y);
}