import * as util from "./util";

export const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export const radix = 32;
export const regex = /[A-Z2-7]/gi;

const bits = util.quickMap(5, x => 2 ** (x * 8)).reverse();
const chars = util.quickMap(8, x => 2 ** (x * 5)).reverse();
const pads = util.quickMap(5, x => (8 - Math.ceil(x * 8 / 5)) % 8);

export function encode(data: string | Buffer, encoding: BufferEncoding = "utf8") {
    let padding = 0;
    return Buffer.from(data.toString(encoding), encoding).reduce((a, x, i, r) => {
        const y = x * bits[i % 5];
        if (i % 5 == 0) a.push(y);
        else a[a.length - 1] += y;

        if ((i + 1) >= r.length) padding = pads[r.length % 5];
        return a;
    }, [] as number[]).map((x, i, r) =>
        chars.slice(0, 8 - ((i + 1) >= r.length ? padding : 0)).map(y =>
            charset[Math.floor(x / y) % 32]).join("")).join("") + "=".repeat(padding);
}

export function decode(data: string, encoding?: BufferEncoding) {
    const decoded = Buffer.from(util.padEnd(data.toString().toUpperCase().match(regex) ?? [], 8)
        .flatMap(x => {
            const value = util.stringToNumber(x, charset);
            return bits.slice(0, pads.findIndex(y => y == (x.match(/=/g) ?? []).length) || 5)
                .map(y => Math.floor(value / y) % 256);
        }));
    return encoding ? decoded.toString(encoding) : decoded;
}
