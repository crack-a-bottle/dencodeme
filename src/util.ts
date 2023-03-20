export const EMPTY_BUFFER = Buffer.of();

function getMapper(length: number) {
    return (a: string[], x: string, i: number) => {
        if (i % length == 0) a.push(x);
        else a[a.length - 1] += x;
        return a;
    }
}

export function padStart(data: string[], length: number): string[] {
    return [ ...Array(length - data.length % length).fill("0"), ...data ].reduce(getMapper(length), []);
}

export function padEnd(data: string[], length: number): string[] {
    return [ ...data, ...Array(length - data.length % length).fill("=") ].reduce(getMapper(length), []);
}

export function quickMap(length: number, multiplier: (x: number) => number) {
    return Array(length).fill(0).map((_, x) => multiplier(x)).reverse();
}

export function stringToNumber(str: string, charset: string) {
    return str.split("").reverse().map(x => charset.indexOf(x)).reduce((a, x, i) => a + (x >= 0 ? x * charset.length ** i : 0), 0);
}
