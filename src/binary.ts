import * as util from "./util";

export function encode(data: string = "") {
    return Array.from(Buffer.from(data)).map(x => x.toString(2).padStart(8, "0")).join("");
}

export function decode(data: string = "") {
    return (util.padZero(data, 8).match(/.{8}/g) ?? []).map(x => String.fromCodePoint(parseInt(x, 2))).join("");
}
