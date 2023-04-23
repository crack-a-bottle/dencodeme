import type { NumberSystem } from ".";
import * as util from "./util";

/** Creates a new number system object with the given radix/base. */
export function base(radix: number): NumberSystem {
    const rdx = Math.floor(Math.min(36, Math.max(2, radix)));
    const max = (255).toString(rdx).length;
    const charset = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, rdx);

    return {
        charset,
        radix: rdx,
        regex: new RegExp(`[${charset}]`, "gi"),
        encode(data, encoding = "utf8") {
            // For each byte of data, encode it into a character.
            return Buffer.from(data.toString(encoding), encoding).toJSON().data.map(x => x.toString(rdx).padStart(max, "0")).join("");
        },
        decode(data, encoding) {
            // For each character of data, decode it into a byte.
            const decoded = Buffer.from(util.padStart((data.toString().toLowerCase().match(this.regex) ?? []).join(""), max).map(x => parseInt(x, rdx)));
            // Return the decoded buffer, or a string if a character encoding is provided.
            return encoding ? decoded.toString(encoding) : decoded;
        }
    }
}
