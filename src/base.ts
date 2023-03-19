import type { NumberSystem } from ".";
import * as util from "./util";

export function base(radix: number): NumberSystem {
    const rdx = Math.floor(Math.min(36, Math.max(2, radix)));
    const max = (255).toString(rdx).length;
    const charset = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, rdx);
    const regex = new RegExp(`[${charset}]`, "gi");

    return {
        charset,
        radix: rdx,
        regex,
        encode(data, encoding = "utf8") {
            return Buffer.from(data.toString(encoding), encoding).reduce((a, x) => a + x.toString(rdx).padStart(max, "0"), "");
        },
        decode(data, encoding) {
            const charMatch = data.toString().toLowerCase().match(regex);
            if (charMatch == null) return "";

            const decoded = util.padStart(charMatch, max).reduce((a, x) =>
                Buffer.concat([a, Buffer.of(parseInt(x, rdx))]), util.EMPTY_BUFFER);
            return encoding ? decoded.toString(encoding) : decoded;
        }
    }
}
