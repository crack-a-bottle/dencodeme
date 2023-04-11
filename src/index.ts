import { base } from "./base";
import * as b32 from "./base32";
import * as b64 from "./base64";

/** The number system object interface. */
export interface NumberSystem {
    /** The character set of the number system. */
    readonly charset: string;
    /** The radix/base of the number system. */
    readonly radix: number;
    /** The regex used to match characters in the number system. */
    readonly regex: RegExp;
    /** Encodes the given data into an encoded string. */
    encode(data: string | Buffer, encoding?: BufferEncoding): string;
    /** Decodes the given encoded string into a buffer, or a string if a character encoding is provided. */
    decode(data: string, encoding?: BufferEncoding): string | Buffer;
}

export * from "./base";

/** The binary (Base 2) number system object. */
export const binary = base(2);
/** The octal (Base 8) number system object. */
export const octal = base(8);
/** The decimal (Base 10) number system object. */
export const decimal = base(10);
/** The hexadecimal (Base 16) number system object. */
export const hexadecimal = base(16);
/** The Base 32 number system object. */
export const base32: NumberSystem = b32;
/** The Base 36 number system object. */
export const base36 = base(36);
/** The Base 64 number system object. */
export const base64: NumberSystem = b64;
