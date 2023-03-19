import * as util from "./util";

export const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export const radix = 32;
export const regex = /[A-Z2-7]/gi;

const bits = Buffer.from(util.quickMap(5, x => x * 8));
const chars = util.quickMap(8, x => x * 5);
const pads = [...util.quickMap(4, x => 8 - Math.ceil((x + 1) * 8 / 5)), 0].reverse();

export function encode(data: string | Buffer, encoding: BufferEncoding = "utf8") {
    let padding = 0;

    return Buffer.from(data.toString(encoding), encoding).reduce((a, x, i, r) => {
        const y = x << bits[i % 5];
        if (i % 5 == 0) a.push(y);
        else a[a.length - 1] += y;

        if ((i + 1) == r.length) padding = pads[r.length % 5];
        return a;
    }, [] as number[]).map((x, i, r) =>
        chars.slice(0, 8 - ((i + 1) == r.length ? padding : 0)).map(y => charset[x >> y & 31])).join("") + "=".repeat(padding);
}

export function decode(data: string, encoding?: BufferEncoding) {
    const charMatch = data.toString().toUpperCase().match(regex);
    if (charMatch == null) return "";

    const decoded = util.padEnd(charMatch, 8).reduce((a, x) => {
        const quintuple = util.stringToNumber(x, charset);
        return Buffer.concat([a, bits.map(y => quintuple >> y & 255)]);
    }, util.EMPTY_BUFFER);
    return encoding ? decoded.toString(encoding) : decoded;
}
