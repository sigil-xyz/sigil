import BN from "bn.js";
import { Capability, PricingModel } from "./types";
export declare function encodeString32(s: string): number[];
export declare function encodeString64(s: string): number[];
export declare function encodeString128(s: string): number[];
export declare function decodeString(bytes: number[] | Uint8Array): string;
export declare function encodeCapabilities(capabilities: Capability[]): {
    category: number[];
    allowedDomains: number[][];
}[];
export declare function decodeCapabilities(raw: {
    category: number[];
    allowedDomains: number[][];
}[]): Capability[];
export declare function encodePricingModel(model: PricingModel): {
    perCall: {
        amount: BN;
    };
    perToken?: undefined;
    subscription?: undefined;
} | {
    perToken: {
        amount: BN;
    };
    perCall?: undefined;
    subscription?: undefined;
} | {
    subscription: {
        monthly: BN;
    };
    perCall?: undefined;
    perToken?: undefined;
};
export declare function decodePricingModel(raw: Record<string, unknown>): PricingModel;
//# sourceMappingURL=utils.d.ts.map