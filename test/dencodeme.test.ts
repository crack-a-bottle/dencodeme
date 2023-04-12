import assert from "assert";
import * as dencodeme from "../src";

describe("dencodeme", () => {
    describe("base", () => {
        it("should encode and decode data", () => {
            const data = "Hello, World!";
            const encoded = dencodeme.base(16).encode(data);
            const decoded = dencodeme.base(16).decode(encoded, "utf8");
            assert.strictEqual(decoded, data);
        });
    });
    describe("base32", () => {
        it("should encode and decode data", () => {
            const data = "Hello, World!";
            const encoded = dencodeme.base32.encode(data);
            const decoded = dencodeme.base32.decode(encoded, "utf8");
            assert.strictEqual(decoded, data);
        });
    });
    describe("base64", () => {
        it("should encode and decode data", () => {
            const data = "Hello, World!";
            const encoded = dencodeme.base64.encode(data);
            const decoded = dencodeme.base64.decode(encoded, "utf8");
            assert.strictEqual(decoded, data);
        });
    });
});
