import * as util from "./util";

export const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export const REGEX = /[A-Z2-7]/gi;

const bits = Buffer.of(32, 24, 16, 8, 0);

export function encode(data: string | Buffer) {
    const chars = [35, 30, 25, 20, 15, 10, 5, 0];
    const pads = [0, 4, 3, 2, 1];
    let padding = 0;

    return Buffer.from(data.toString()).reduce((a: number[], x: number, i: number, b: Uint8Array) => {
        const y = x << bits[i % 5];
        if (i % 5 == 0) a.push(y);
        else a[a.length - 1] += y;

        if ((i + 1) == b.length) padding = pads[b.length % 5];
        return a;
    }, []).reduce((r, x, i, b) =>
        r + chars.slice(0, 8 - ((i + 1) == b.length ? padding : 0)).reduce((a, y) => a + CHARSET[x >> y & 31], ""), "") + "=".repeat(padding);
}

export function decode(data: string, encoding?: BufferEncoding) {
    const charMatch = data.toString().toUpperCase().match(REGEX);
    if (charMatch == null) return "";

    const decoded = util.padEnd(charMatch, 8).reduce((r: Buffer, x: string) => {
        const quintuple = x.split("").reverse().map(CHARSET.indexOf).reduce((a, y, i) => a + (y >= 0 ? y * 32 ** i : 0), 0);
        return Buffer.concat([r, bits.map(y => quintuple >> y & 255)]);
    }, util.EMPTY_BUFFER);
    return encoding ? decoded.toString(encoding) : decoded;
}
