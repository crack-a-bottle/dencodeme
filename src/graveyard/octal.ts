import * as util from "../util";

export const CHARSET = "01234567";
export const REGEX = /[0-7]/gi;

export function encode(data: string = "") {
    const bits = [6, 3, 0];

    return Buffer.from(data.toString(), "latin1").reduce((r: string, x: number) =>
        r + bits.reduce((a, y) => a + CHARSET[x >> y & 7], ""), "");
}

export function decode(data: string = "") {
    const charMatch = data.toString().match(REGEX);
    if (charMatch == null) return "";

    return util.padStart(charMatch, 3).reduce((r: string, x: string) =>
        r + String.fromCodePoint(x.split("").reverse().map(CHARSET.indexOf).reduce((a, y, i) => a + y * 8 ** i, 0)), "");
}
