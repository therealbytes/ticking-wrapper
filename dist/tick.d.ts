import { TickConfig } from "./types";
import { Logger } from "./logger";
import { Contract } from "@ethersproject/contracts";
export declare function tick(nonce: number, tickConfig: TickConfig, tickContract: Contract, logger: Logger): Promise<void>;
export declare function startTick(tickConfig: TickConfig, logger: Logger): Promise<void>;
