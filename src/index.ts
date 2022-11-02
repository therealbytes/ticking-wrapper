import { TickConfig, TestnetConfig, Command, Success } from "./types";

import {
  tickCmdOptions,
  tickContractConfig,
  signerConfig,
  tickTxConfig,
  testnetConfigs,
} from "./config";

import { createLogger } from "./logger";
import { extractCmds, validateCmd } from "./cmd";
import { startCmdProc } from "./proc";
import { startTick } from "./tick";

function getTestnetConfig(testnet: string): TestnetConfig {
  return testnetConfigs[testnet];
}

function overrideTickConfig(tickConfig: TickConfig, cmd: Command) {
  const txConfig = tickConfig.tickTxConfig;
  const cmdOptions = tickConfig.tickCmdOptions;
  for (let ii = 0; ii < cmd.options.length; ii++) {
    const opt = cmd.options[ii];
    if (opt.startsWith("--tick-gas-limit=")) {
      txConfig.gasLimit = parseInt(opt.slice(17));
    } else if (opt.startsWith("--mute-logs=")) {
      cmdOptions.log.muteList = opt.slice(12).split(",");
    }
  }
}

function main() {
  const [tickCmd, cmd] = extractCmds(process.argv);

  let success: Success;
  success = validateCmd(tickCmd);
  if (!success.ok) {
    console.error("invalid ticking command:", success.error?.message);
    process.exit();
  }
  success = validateCmd(cmd);
  if (!success.ok) {
    console.error("invalid node command:", success.error?.message);
    process.exit();
  }

  const testnetConfig = getTestnetConfig(cmd.command);
  if (testnetConfig === undefined) {
    console.error("testnet not supported");
    process.exit();
  }

  const tickConfig: TickConfig = {
    tickCmdOptions,
    tickContractConfig,
    tickTxConfig,
    testnetConfig,
    signerConfig,
  };

  overrideTickConfig(tickConfig, tickCmd);

  const tickLogger = createLogger("[tick-wrap]");
  const cmdLogger = createLogger(null, tickConfig.tickCmdOptions.log.muteList);

  startCmdProc(cmd, cmdLogger);
  setTimeout(() => startTick(tickConfig, tickLogger), 1000);
}

main();
