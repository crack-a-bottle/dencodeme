import * as util from "./util";

export const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"; // The base 32 character set.
export const radix = 32; // The base 32 radix.
export const regex = /[A-Z2-7]/gi; // The base 32 regex.

const bits = util.quickMap(5, x => 2 ** (x * 8), true); // 4294967296, 16777216, 65536, 256, 1
const chars = util.quickMap(8, x => 2 ** (x * 5), true); // 34359738368, 1073741824, 33554432, 1048576, 32768, 1024, 32, 1
const pads = util.quickMap(5, x => (8 - Math.ceil((x * 8) / 5)) % 8, false); // 0, 6, 4, 3, 1

// Encodes the given data into a Base 32 encoded string.
export function encode(
    data: string | Buffer,
    encoding: BufferEncoding = "utf8"
) {
    // The number of padding characters to add to the end of the encoded string.
    let padding = 0;
    // For each 5 bytes of data, encode them into 8 characters. (With padding if necessary.)
    return (
        Buffer.from(data.toString(encoding), encoding)
            .reduce((a, x, i, r) => {
                if (i % 5 == 0) a.push(0);
                a[a.length - 1] += x * bits[i % 5];

                if (i + 1 >= r.length) padding = pads[r.length % 5];
                return a;
            }, [] as number[])
            .map((x, i, r) =>
                chars
                    .slice(0, 8 - Number(i + 1 >= r.length) * padding)
                    .map(y => charset[Math.floor(x / y) % 32])
                    .join("")
            )
            .join("") + "=".repeat(padding)
    );
}

// Decodes the given Base 32 encoded string into a buffer, or a string if a character encoding is provided.
export function decode(data: string, encoding?: BufferEncoding) {
    // For each 8 characters of data, decode them into 5 bytes.
    const decoded = Buffer.from(
        util
            .padEnd(
                (data.toString().toUpperCase().match(regex) ?? []).join(""),
                8
            )
            .flatMap(x => {
                const value = util.stringToNumber(x, charset);
                return bits
                    .slice(0, pads.indexOf((x.match(/=/g) ?? []).length) || 5)
                    .map(y => Math.floor(value / y) % 256);
            })
    );
    // Return the decoded buffer, or a string if a character encoding is provided.
    return encoding ? decoded.toString(encoding) : decoded;
}
