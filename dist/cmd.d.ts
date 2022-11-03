import { Command, Success } from "./types";
export declare function extractCmds(argv: string[]): [Command, Command];
export declare function validateCmd(cmd: Command): Success;
