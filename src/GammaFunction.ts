const LOG_2PI = Math.log(2 * Math.PI);
const N = 8;

// Bernoulli numbers
const B0 = 1;
const B1 = -1/2;
const B2 = 1/6;
const B4 = -1/30;
const B6 = 1/42;
const B8 = -1/30;
const B10 = 5/66;
const B12 = -691/2730;
const B14 = 7/6;
const B16 = -3617/510;

export function logGamma(x: number): number {
    let v = 1;
    while(x < N){ v *= x; x++; }
    let w = 1/(x*x);
    let ret =       B16 / (16 * 15);
    ret = ret * w + B14 / (14 * 13);
    ret = ret * w + B12 / (12 * 11);
    ret = ret * w + B10 / (10 *  9);
    ret = ret * w + B8  / ( 8 *  7);
    ret = ret * w + B6  / ( 6 *  5);
    ret = ret * w + B4  / ( 4 *  3);
    ret = ret * w + B2  / ( 2 *  1);
    ret = ret / x + 0.5 * LOG_2PI - Math.log(v) - x + (x - 0.5) * Math.log(x);
    return ret;
}

export function gamma(x: number): number {
    if(x < 0){
        return Math.PI / (Math.sin(Math.PI * x) * Math.exp(logGamma(1 - x)));
    }else{
        return Math.exp(logGamma(x));
    }
}