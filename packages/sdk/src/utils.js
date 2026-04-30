"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeString32 = encodeString32;
exports.encodeString64 = encodeString64;
exports.encodeString128 = encodeString128;
exports.decodeString = decodeString;
exports.encodeCapabilities = encodeCapabilities;
exports.decodeCapabilities = decodeCapabilities;
exports.encodePricingModel = encodePricingModel;
exports.decodePricingModel = decodePricingModel;
const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();
function encodeString32(s) {
    const buf = new Uint8Array(32);
    const encoded = ENCODER.encode(s);
    buf.set(encoded.slice(0, 32));
    return Array.from(buf);
}
function encodeString64(s) {
    const buf = new Uint8Array(64);
    const encoded = ENCODER.encode(s);
    buf.set(encoded.slice(0, 64));
    return Array.from(buf);
}
function encodeString128(s) {
    const buf = new Uint8Array(128);
    const encoded = ENCODER.encode(s);
    buf.set(encoded.slice(0, 128));
    return Array.from(buf);
}
function decodeString(bytes) {
    const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    const end = arr.indexOf(0);
    return DECODER.decode(end === -1 ? arr : arr.slice(0, end));
}
function encodeCapabilities(capabilities) {
    return capabilities.map((cap) => ({
        category: encodeString32(cap.category),
        allowedDomains: cap.allowedDomains.map(encodeString64),
    }));
}
function decodeCapabilities(raw) {
    return raw.map((cap) => ({
        category: decodeString(cap.category),
        allowedDomains: cap.allowedDomains.map(decodeString),
    }));
}
function encodePricingModel(model) {
    switch (model.kind) {
        case "perCall":
            return { perCall: { amount: model.amount } };
        case "perToken":
            return { perToken: { amount: model.amount } };
        case "subscription":
            return { subscription: { monthly: model.monthly } };
    }
}
function decodePricingModel(raw) {
    if ("perCall" in raw) {
        const v = raw.perCall;
        return { kind: "perCall", amount: v.amount };
    }
    if ("perToken" in raw) {
        const v = raw.perToken;
        return { kind: "perToken", amount: v.amount };
    }
    if ("subscription" in raw) {
        const v = raw.subscription;
        return { kind: "subscription", monthly: v.monthly };
    }
    throw new Error(`Unknown pricing model variant: ${JSON.stringify(raw)}`);
}
//# sourceMappingURL=utils.js.map