import { Command } from "./types";
import { Logger } from "./logger";

import { spawn } from "child_process";

export type CmdProcess = ReturnType<typeof spawn>;

export function startCmdProc(cmd: Command, logger: Logger) {
  const cmdProc = createCmdProcess(cmd);
  handleStd(cmdProc, logger);
  handleError(cmdProc, logger);
  handleClose(cmdProc, logger);
  handleNodeClose(cmdProc, logger);
  pipeSignal(cmdProc, logger);
}

function createCmdProcess(cmd: Command): CmdProcess {
  return spawn(cmd.command, cmd.options);
}

function handleStd(proc: CmdProcess, logger: Logger) {
  proc.stdout?.on("data", (data) => {
    logger.info(data.toString());
  });
  proc.stderr?.on("data", (data) => {
    logger.warning(data.toString());
  });
}

function handleError(proc: CmdProcess, logger: Logger) {
  proc.on("error", (error) => {
    logger.error(error.message);
  });
}

function handleClose(proc: CmdProcess, logger: Logger) {
  proc.on("close", (code) => {
    logger.info("\ncommand subprocess exited with code", code);
    process.exit();
  });
}

function handleNodeClose(proc: CmdProcess, logger: Logger) {
  process.on("exit", () => {
    proc.kill("SIGINT");
  });
}

function pipeSignal(proc: CmdProcess, logger: Logger) {
  process.on("SIGINT", () => {
    proc.kill("SIGINT");
  });
}
