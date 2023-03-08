import { base } from "./base";
import * as b32 from "./base32";
import * as b64 from "./base64";

export interface BaseObject {
    readonly CHARSET: string;
    readonly REGEX: RegExp;
    encode(data: string | Buffer): string;
    decode(data: string, encoding?: BufferEncoding): string | Buffer;
}

export * from "./base";

export const binary = base(2);
export const octal = base(8);
export const decimal = base(10);
export const hex = base(16);
export const base32 = b32 as BaseObject;
export const base36 = base(36);
export const base64 = b64 as BaseObject;