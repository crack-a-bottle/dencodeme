import * as util from "./util";

export const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; // The base 64 character set.
export const radix = 64; // The base 64 radix.
export const regex = /[A-Za-z0-9+/]/gi; // The base 64 regex.

const bits = util.quickMap(3, x => 2 ** (x * 8), true); // 65536, 256, 1
const chars = util.quickMap(4, x => 2 ** (x * 6), true); // 262144, 4096, 64, 1
const pads = util.quickMap(3, x => (4 - Math.ceil((x * 4) / 3)) % 4, false); // 0, 2, 1

// Encodes the given data into a Base 64 encoded string.
export function encode(
    data: string | Buffer,
    encoding: BufferEncoding = "utf8"
) {
    // The number of padding characters to add to the end of the encoded string.
    let padding = 0;
    // For each 3 bytes of data, encode them into 4 characters. (With padding if necessary.)
    return (
        Buffer.from(data.toString(encoding), encoding)
            .reduce((a, x, i, r) => {
                if (i % 3 == 0) a.push(0);
                a[a.length - 1] += x * bits[i % 3];

                if (i + 1 >= r.length) padding = pads[r.length % 3];
                return a;
            }, [] as number[])
            .map((x, i, r) =>
                chars
                    .slice(0, 4 - Number(i + 1 >= r.length) * padding)
                    .map(y => charset[Math.floor(x / y) % 64])
                    .join("")
            )
            .join("") + "=".repeat(padding)
    );
}

// Decodes the given Base 64 encoded string into a buffer, or a string if a character encoding is provided.
export function decode(data: string, encoding?: BufferEncoding) {
    // For each 4 characters of data, decode them into 3 bytes.
    const decoded = Buffer.from(
        util
            .padEnd(
                (
                    data
                        .toString()
                        .replaceAll("-", "+")
                        .replaceAll("_", "/")
                        .match(regex) ?? []
                ).join(""),
                4
            )
            .flatMap(x => {
                const value = util.stringToNumber(x, charset);
                return bits
                    .slice(0, pads.indexOf((x.match(/=/g) ?? []).length) || 3)
                    .map(y => Math.floor(value / y) % 256);
            })
    );
    // Return the decoded buffer, or a string if a character encoding is provided.
    return encoding ? decoded.toString(encoding) : decoded;
}
