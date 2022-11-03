import { AddressStorage, TestnetConfig } from "./types";
import { JsonRpcProvider } from "@ethersproject/providers";
export declare function setCode(testnetConfig: TestnetConfig, provider: JsonRpcProvider, address: string, bytecode: string): Promise<any>;
export declare function setBalance(testnetConfig: TestnetConfig, provider: JsonRpcProvider, address: string, balance: string): Promise<any>;
export declare function setStorage(testnetConfig: TestnetConfig, provider: JsonRpcProvider, address: string, storage?: AddressStorage): Promise<any>;
