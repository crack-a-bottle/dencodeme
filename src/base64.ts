import * as util from "./util";

export const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export const radix = 64;
export const regex = /[A-Za-z0-9+/]/gi;

const bits = util.quickMap(3, x => 2 ** (x * 8)).reverse();
const chars = util.quickMap(4, x => 2 ** (x * 6)).reverse();
const pads = util.quickMap(3, x => (4 - Math.ceil(x * 4 / 3)) % 4);

export function encode(data: string | Buffer, encoding: BufferEncoding = "utf8") {
    let padding = 0;
    return Buffer.from(data.toString(encoding), encoding).reduce((a, x, i, r) => {
        const y = x * bits[i % 3];
        if (i % 3 == 0) a.push(y);
        else a[a.length - 1] += y;

        if ((i + 1) >= r.length) padding = pads[r.length % 3];
        return a;
    }, [] as number[]).map((x, i, r) =>
        chars.slice(0, 4 - ((i + 1) >= r.length ? padding : 0)).map(y =>
            charset[Math.floor(x / y) % 64]).join("")).join("") + "=".repeat(padding);
}

export function decode(data: string, encoding?: BufferEncoding) {
    const decoded = Buffer.from(util.padEnd(data.toString().replaceAll("-", "+").replaceAll("_", "/").match(regex) ?? [], 4)
        .flatMap(x => {
            const value = util.stringToNumber(x, charset);
            return bits.slice(0, pads.findIndex(y => y == (x.match(/=/g) ?? []).length) || 3)
                .map(y => Math.floor(value / y) % 256);
        }));
    return encoding ? decoded.toString(encoding) : decoded;
}
