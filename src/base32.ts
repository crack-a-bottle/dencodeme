import * as util from "./util";

export const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export const radix = 32;
export const regex = /[A-Z2-7]/gi;

const bits = Buffer.from(util.quickMap(5, x => x * 8));
const chars = util.quickMap(8, x => x * 5);
const pads = [0, ...util.quickMap(4, x => x + 1)];

export function encode(data: string | Buffer, encoding: BufferEncoding = "utf8") {
    let padding = 0;

    return Buffer.from(data.toString(encoding), encoding).reduce((a, x, i, b) => {
        const y = x << bits[i % 5];
        if (i % 5 == 0) a.push(y);
        else a[a.length - 1] += y;

        if ((i + 1) == b.length) padding = pads[b.length % 5];
        return a;
    }, [] as number[]).reduce((r, x, i, b) =>
        r + chars.slice(0, 8 - ((i + 1) == b.length ? padding : 0)).reduce((a, y) => a + charset[x >> y & 31], ""), "") + "=".repeat(padding);
}

export function decode(data: string, encoding?: BufferEncoding) {
    const charMatch = data.toString().toUpperCase().match(regex);
    if (charMatch == null) return "";

    const decoded = util.padEnd(charMatch, 8).reduce((r: Buffer, x: string) => {
        const quintuple = util.stringToNumber(x, charset);
        return Buffer.concat([r, bits.map(y => quintuple >> y & 255)]);
    }, util.EMPTY_BUFFER);
    return encoding ? decoded.toString(encoding) : decoded;
}
