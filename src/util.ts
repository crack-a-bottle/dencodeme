// Returns a mapper function to split a string into an array of strings of the given length.
function getMapper(length: number) {
    return (a: string[], x: string, i: number) => {
        if (i % length == 0) a.push(x);
        else a[a.length - 1] += x;
        return a;
    }
}

// Pads the given string with zeros to the left, and splits it into an array of strings of the given length.
export function padStart(data: string, length: number): string[] {
    return [ ...Array((length - data.length % length) % length).fill("0"), ...data ].reduce(getMapper(length), []);
}

// Pads the given string with equals signs to the right, and splits it into an array of strings of the given length.
export function padEnd(data: string, length: number): string[] {
    return [ ...data, ...Array((length - data.length % length) % length).fill("=") ].reduce(getMapper(length), []);
}

// Creates an array of numbers from 0 to length - 1, and multiplies each number by the given multiplier.
export function quickMap(length: number, multiplier: (x: number) => number, reverse: boolean = false) {
    return Array(length).fill(0).map((_, x) => multiplier(reverse ? -x + length - 1 : x));
}

// Converts the given string to a number using the given character set.
export function stringToNumber(str: string, charset: string) {
    return str.split("").reverse().map(x => charset.indexOf(x)).reduce((a, x, i) => a + (x >= 0 ? x * charset.length ** i : 0), 0);
}
