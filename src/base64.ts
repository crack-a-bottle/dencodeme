import * as util from "./util";

export const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export const radix = 64;
export const regex = /[A-Za-z0-9+/]/gi;

const bits = Buffer.from(util.quickMap(3, x => x * 8));
const chars = util.quickMap(4, x => x * 6);
const pads = [...util.quickMap(2, x => 4 - Math.ceil((x + 1) * 4 / 3)), 0].reverse();

export function encode(data: string | Buffer, encoding: BufferEncoding = "utf8") {
    let padding = 0;

    return Buffer.from(data.toString(encoding), encoding).reduce((a, x, i, r) => {
        const y = x << bits[i % 3];
        if (i % 3 == 0) a.push(y);
        else a[a.length - 1] += y;

        if ((i + 1) == r.length) padding = pads[r.length % 3];
        return a;
    }, [] as number[]).map((x, i, r) =>
        chars.slice(0, 4 - ((i + 1) == r.length ? padding : 0)).reduce((a, y) => a + charset[x >> y & 63], "")) + "=".repeat(padding);
}

export function decode(data: string, encoding?: BufferEncoding) {
    const charMatch = data.toString().replaceAll("-", "+").replaceAll("_", "/").match(regex);
    if (charMatch == null) return "";

    const decoded = util.padEnd(charMatch, 4).reduce((a: Buffer, x: string) => {
        const triple = util.stringToNumber(x, charset);
        return Buffer.concat([a, bits.map(y => triple >> y & 255)]);
    }, util.EMPTY_BUFFER);
    return encoding ? decoded.toString(encoding) : decoded;
}
