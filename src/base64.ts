import * as binary from "./binary";
import * as util from "./util";

export const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

export function encode(data: string = "") {
    return (util.padZero(binary.encode(data), 6).match(/.{6}/g) ?? []).map(x => CHARSET[parseInt(x, 2)]).join("");
}

export function decode(data: string = "") {
    return (data.padStart(data.length + (8 - data.length % 8), "0").match(/.{8}/) ?? []).map(x => String.fromCodePoint(parseInt(x, 2))).join("");
}
