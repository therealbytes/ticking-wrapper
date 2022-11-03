/// <reference types="node" />
import { Command } from "./types";
import { Logger } from "./logger";
import { spawn } from "child_process";
export declare type CmdProcess = ReturnType<typeof spawn>;
export declare function startCmdProc(cmd: Command, logger: Logger): void;
