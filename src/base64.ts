import * as util from "./util";

export const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export const REGEX = /[A-Za-z0-9+/]/gi;

const bits = Buffer.of(16, 8, 0);

export function encode(data: string | Buffer, encoding: BufferEncoding = "utf8") {
    const chars = [18, 12, 6, 0];
    const pads = [0, 2, 1];
    let padding = 0;

    return Buffer.from(data.toString(encoding), encoding).reduce((a: number[], x: number, i: number, b: Uint8Array) => {
        const y = x << bits[i % 3];
        if (i % 3 == 0) a.push(y);
        else a[a.length - 1] += y;

        if ((i + 1) == b.length) padding = pads[b.length % 3];
        return a;
    }, []).reduce((r, x, i, b) =>
        r + chars.slice(0, 4 - ((i + 1) == b.length ? padding : 0)).reduce((a, y) => a + CHARSET[x >> y & 63], ""), "") + "=".repeat(padding);
}

export function decode(data: string, encoding?: BufferEncoding) {
    const charMatch = data.toString().replaceAll("-", "+").replaceAll("_", "/").match(REGEX);
    if (charMatch == null) return "";

    const decoded = util.padEnd(charMatch, 4).reduce((r: Buffer, x: string) => {
        const triple = x.split("").reverse().map(CHARSET.indexOf).reduce((a, y, i) => a + (y >= 0 ? y * 64 ** i : 0), 0);
        return Buffer.concat([r, bits.map(y => triple >> y & 255)]);
    }, util.EMPTY_BUFFER);
    return encoding ? decoded.toString(encoding) : decoded;
}
