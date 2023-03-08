import * as util from "../util";

export const CHARSET = "0123456789abcdef";
export const REGEX = /[0-9a-f]/gi;

export function encode(data: string = "") {
    const bits = [4, 0];

    return Buffer.from(data.toString(), "latin1").reduce((r: string, x: number) =>
        r + bits.reduce((a, y) => a + CHARSET[x >> y & 15], ""), "");
}

export function decode(data: string = "") {
    const charMatch = data.toString().toLowerCase().match(REGEX);
    if (charMatch == null) return "";

    return util.padStart(charMatch, 2).reduce((r: string, x: string) =>
        r + String.fromCodePoint(x.split("").reverse().map(CHARSET.indexOf).reduce((a, y, i) => a + y * 16 ** i, 0)), "");
}
