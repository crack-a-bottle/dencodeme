import type { BaseObject } from ".";
import * as util from "./util";

export function base(radix: number): BaseObject {
    const rdx = Math.floor(Math.min(36, Math.max(0, radix)));
    const max = (255).toString(rdx).length;
    const CHARSET = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, rdx);
    const REGEX = new RegExp(`[${CHARSET}]`, "gi");

    return {
        CHARSET,
        REGEX,
        encode(data) {
            return Buffer.from(data.toString()).reduce((r: string, x: number) => r + x.toString(rdx).padStart(max, "0"), "");
        },
        decode(data, encoding) {
            const charMatch = data.toString().toLowerCase().match(REGEX);
            if (charMatch == null) return "";

            const decoded = util.padStart(charMatch, max).reduce((r: Buffer, x: string) =>
                Buffer.concat([r, Buffer.of(parseInt(x, rdx))]), util.EMPTY_BUFFER);
            return encoding ? decoded.toString(encoding) : decoded;
        }
    }
}
