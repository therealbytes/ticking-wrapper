import { spawn } from "child_process";
import { JsonRpcProvider } from "@ethersproject/providers";

type CmdProcess = ReturnType<typeof spawn>;
type Logger = {
  info: (...args: any[]) => void;
  warning: (...args: any[]) => void;
  error: (...args: any[]) => void;
};

function createLogger(logPrefix: string | null = "[tick-wrap]"): Logger {
  if (logPrefix === null) {
    return {
      info: console.log,
      warning: console.warn,
      error: console.error,
    };
  }
  return {
    info: (...args: any[]) => {
      console.log(logPrefix, ...args);
    },
    warning: (...args: any[]) => {
      console.warn(logPrefix, ...args);
    },
    error: (...args: any[]) => {
      console.error(logPrefix, ...args);
    },
  };
}

function createTickProvider(): JsonRpcProvider {
  return new JsonRpcProvider("http://localhost:8545");
}

async function startTick(logger: Logger) {
  const provider = createTickProvider();
  provider.on("block", (blockNumber) => {
    logger.info("new block", blockNumber);
  });
}

function pipeSignal(proc: CmdProcess, logger: Logger) {
  process.on("SIGINT", () => {
    proc.kill("SIGINT");
  });
}

function createCmdProcess(command: string, options: string[]): CmdProcess {
  return spawn(command, options);
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

function startCmdProc(command: string, options: string[], logger: Logger) {
  // const logPrefix = `[${command}]`;
  const logPrefix = null;
  logger = createLogger(logPrefix);
  const cmdProc = createCmdProcess(command, options);
  handleStd(cmdProc, logger);
  handleError(cmdProc, logger);
  handleClose(cmdProc, logger);
  pipeSignal(cmdProc, logger);
}

function validateCmd(cmd: string, opt: string[]) {
  if (cmd === undefined) {
    return false;
  }
  return true;
}

function extractCmd(argv: string[]) {
  const cmd = argv[2];
  const opt = argv.slice(3);
  return { cmd, opt };
}

async function main() {
  const logger = createLogger();
  const { cmd, opt } = extractCmd(process.argv);
  const ok = validateCmd(cmd, opt);
  if (!ok) {
    console.error("invalid command");
    process.exit();
  }
  startCmdProc(cmd, opt, logger);
  startTick(logger);
}

main();
