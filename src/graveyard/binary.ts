import * as util from "../util";

export const CHARSET = "01";
export const REGEX = /[01]/gi;

export function encode(data: string = "") {
    const bits = [7, 6, 5, 4, 3, 2, 1, 0];

    return Buffer.from(data.toString(), "latin1").reduce((r: string, x: number) =>
        r + bits.reduce((a, y) => a + CHARSET[x >> y & 1], ""), "");
}

export function decode(data: string = "") {
    const charMatch = data.toString().match(REGEX);
    if (charMatch == null) return "";

    return util.padStart(charMatch, 8).reduce((r: string, x: string) =>
        r + String.fromCodePoint(x.split("").reverse().map(CHARSET.indexOf).reduce((a, y, i) => a + y * 2 ** i, 0)), "");
}
