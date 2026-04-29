import BN from "bn.js";
import { Capability, PricingModel } from "./types";

const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

export function encodeString32(s: string): number[] {
  const buf = new Uint8Array(32);
  const encoded = ENCODER.encode(s);
  buf.set(encoded.slice(0, 32));
  return Array.from(buf);
}

export function encodeString64(s: string): number[] {
  const buf = new Uint8Array(64);
  const encoded = ENCODER.encode(s);
  buf.set(encoded.slice(0, 64));
  return Array.from(buf);
}

export function encodeString128(s: string): number[] {
  const buf = new Uint8Array(128);
  const encoded = ENCODER.encode(s);
  buf.set(encoded.slice(0, 128));
  return Array.from(buf);
}

export function decodeString(bytes: number[] | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const end = arr.indexOf(0);
  return DECODER.decode(end === -1 ? arr : arr.slice(0, end));
}

export function encodeCapabilities(capabilities: Capability[]) {
  return capabilities.map((cap) => ({
    category: encodeString32(cap.category),
    allowedDomains: cap.allowedDomains.map(encodeString64),
  }));
}

export function decodeCapabilities(
  raw: { category: number[]; allowedDomains: number[][] }[]
): Capability[] {
  return raw.map((cap) => ({
    category: decodeString(cap.category),
    allowedDomains: cap.allowedDomains.map(decodeString),
  }));
}

export function encodePricingModel(model: PricingModel) {
  switch (model.kind) {
    case "perCall":
      return { perCall: { amount: model.amount } };
    case "perToken":
      return { perToken: { amount: model.amount } };
    case "subscription":
      return { subscription: { monthly: model.monthly } };
  }
}

export function decodePricingModel(raw: Record<string, unknown>): PricingModel {
  if ("perCall" in raw) {
    const v = raw.perCall as { amount: unknown };
    return { kind: "perCall", amount: v.amount as BN };
  }
  if ("perToken" in raw) {
    const v = raw.perToken as { amount: unknown };
    return { kind: "perToken", amount: v.amount as BN };
  }
  if ("subscription" in raw) {
    const v = raw.subscription as { monthly: unknown };
    return { kind: "subscription", monthly: v.monthly as BN };
  }
  throw new Error(`Unknown pricing model variant: ${JSON.stringify(raw)}`);
}
