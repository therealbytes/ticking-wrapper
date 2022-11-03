import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { Contract, EventFilter } from "@ethersproject/contracts";
import { TickConfig } from "./types";
export declare function createTickProvider(tickConfig: TickConfig): JsonRpcProvider;
export declare function createSigner(tickConfig: TickConfig, provider: JsonRpcProvider): Promise<Wallet>;
export declare function createTickContract(signer: Wallet, owner: string, tickConfig: TickConfig, provider: JsonRpcProvider): Promise<Contract>;
export declare function createErrorFilter(tickContract: Contract): EventFilter;
