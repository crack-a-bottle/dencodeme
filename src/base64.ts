import * as util from "./util";

export const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export const radix = 64;
export const regex = /[A-Za-z0-9+/]/gi;

const bits = util.quickMap(3, x => 2 ** (x * 8), true); // 65536, 256, 1
const chars = util.quickMap(4, x => 2 ** (x * 6), true); // 262144, 4096, 64, 1
const pads = util.quickMap(3, x => (4 - Math.ceil(x * 4 / 3)) % 4, false); // 0, 2, 1

// Encodes the given data into a Base 64 encoded string.
export function encode(data: string | Buffer, encoding: BufferEncoding = "utf8") {
    let padding = 0;
    return Buffer.from(data.toString(encoding), encoding).reduce((a, x, i, r) => {
        if (i % 3 == 0) a.push(0);
        a[a.length - 1] += x * bits[i % 3];

        if ((i + 1) >= r.length) padding = pads[r.length % 3];
        return a;
    }, [] as number[]).map((x, i, r) =>
        chars.slice(0, 4 - ((i + 1) >= r.length ? padding : 0)).map(y =>
            charset[Math.floor(x / y) % 64]).join("")).join("") + "=".repeat(padding);
}

// Decodes the given Base 64 encoded string into a buffer, or a string if a character encoding is provided.
export function decode(data: string, encoding?: BufferEncoding) {
    const decoded = Buffer.from(util.padEnd((data.toString().replaceAll("-", "+").replaceAll("_", "/").match(regex) ?? []).join(""), 4)
        .flatMap(x => {
            const value = util.stringToNumber(x, charset);
            return bits.slice(0, pads.findIndex(y => y == (x.match(/=/g) ?? []).length) || 3)
                .map(y => Math.floor(value / y) % 256);
        }));
    return encoding ? decoded.toString(encoding) : decoded;
}
