import { TickConfig, TestnetConfig, Command, Success } from "./types";

import {
  tickContractConfig as _tickContractConfig,
  signerConfig as _signerConfig,
  tickTxConfig as _tickTxConfig,
  testnetConfigs as _testnetConfigs,
} from "./config";

import { createLogger } from "./logger";
import { extractCmds, validateCmd, startCmdProc } from "./cmd";
import { startTick } from "./tick";

function getTestnetConfig(testnet: string): TestnetConfig {
  return _testnetConfigs[testnet];
}

function overrideTickConfig(tickConfig: TickConfig, cmd: Command) {
  const tickTxConfig = tickConfig.tickTxConfig;
  for (let ii = 0; ii < cmd.options.length; ii++) {
    const opt = cmd.options[ii];
    if (opt.startsWith("--tick-gas-limit=")) {
      tickTxConfig.gasLimit = parseInt(opt.slice(17));
    }
  }
}

function main() {
  const logger = createLogger("[tick-wrap]");

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

  logger.info("ticking command", tickCmd);
  logger.info("devnet command", cmd);

  const testnetConfig = getTestnetConfig(cmd.command);
  if (testnetConfig === undefined) {
    console.error("testnet not supported");
    process.exit();
  }

  const tickConfig: TickConfig = {
    testnetConfig,
    tickContractConfig: _tickContractConfig,
    tickTxConfig: _tickTxConfig,
    signerConfig: _signerConfig,
  };
  overrideTickConfig(tickConfig, tickCmd);
  logger.info("tick tx config", tickConfig.tickTxConfig);

  startCmdProc(cmd, logger);
  setTimeout(() => startTick(tickConfig, logger), 1000);
}

main();
