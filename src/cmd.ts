import { Command, Success } from "./types";
import { createLogger, Logger } from "./logger";

import { spawn } from "child_process";

export type CmdProcess = ReturnType<typeof spawn>;

export function extractCmds(argv: string[]): [Command, Command] {
  let pp: number;
  if (argv[0].endsWith("node")) {
    pp = 1;
  } else {
    pp = 1;
  }

  const tickCmd = { command: argv[pp], options: new Array<string>() };
  pp++;
  while (pp < argv.length) {
    const arg = argv[pp];
    if (arg.startsWith("--")) {
      tickCmd.options.push(arg);
    } else {
      break;
    }
    pp++;
  }

  const cmd: Command = { command: argv[pp], options: new Array<string>() };
  pp++;
  cmd.options = argv.slice(pp);

  return [tickCmd, cmd];
}

export function validateCmd(cmd: Command): Success {
  if (cmd.command === undefined) {
    return { ok: false, error: new Error("command is undefined") };
  }
  if (cmd.command.length == 0) {
    return { ok: false, error: new Error("command is empty") };
  }
  return { ok: true, error: null };
}

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
