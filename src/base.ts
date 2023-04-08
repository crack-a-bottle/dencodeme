import type { NumberSystem } from ".";
import * as util from "./util";

export function base(radix: number): NumberSystem {
    const rdx = Math.floor(Math.min(36, Math.max(2, radix)));
    const max = (255).toString(rdx).length;
    const charset = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, rdx);

    return {
        charset,
        radix: rdx,
        regex: new RegExp(`[${charset}]`, "gi"),
        encode(data, encoding = "utf8") {
            return Buffer.from(data.toString(encoding), encoding).toJSON().data.map(x => x.toString(rdx).padStart(max, "0")).join("");
        },
        decode(data, encoding) {
            const charMatch = data.toString().toLowerCase().match(this.regex);
            if (charMatch == null) return "";

            const decoded = Buffer.from(util.padStart(charMatch, max).map(x => parseInt(x, rdx)));
            return encoding ? decoded.toString(encoding) : decoded;
        }
    }
}
