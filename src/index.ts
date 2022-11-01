import {
  tickContractConfig as _tickContractConfig,
  signerConfig as _signerConfig,
  tickTxConfig as _tickTxConfig,
  testnetConfigs as _testnetConfigs,
} from "./config";

import { spawn } from "child_process";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { Contract } from "@ethersproject/contracts";
import { hexZeroPad } from "@ethersproject/bytes";
import {
  TickConfig,
  ContractConfig,
  AddressStorage,
  TestnetConfig,
  Command,
  Success,
  SignerConfig,
} from "./types";

type CmdProcess = ReturnType<typeof spawn>;
type Logger = {
  info: (...args: any[]) => void;
  warning: (...args: any[]) => void;
  error: (...args: any[]) => void;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

function getTestnetConfig(testnet: string): TestnetConfig {
  return _testnetConfigs[testnet];
}

function setCode(
  testnetConfig: TestnetConfig,
  provider: JsonRpcProvider,
  address: string,
  bytecode: string
) {
  return provider.send(testnetConfig.methods.setCode, [address, bytecode]);
}

function setBalance(
  testnetConfig: TestnetConfig,
  provider: JsonRpcProvider,
  address: string,
  balance: string
) {
  return provider.send(testnetConfig.methods.setBalance, [address, balance]);
}

function setStorage(
  testnetConfig: TestnetConfig,
  provider: JsonRpcProvider,
  address: string,
  storage?: AddressStorage
) {
  if (!storage) {
    return Promise.resolve();
  }
  const prom: Promise<any>[] = [];
  for (const slot in storage) {
    const value = storage[slot];
    prom.push(
      provider.send(testnetConfig.methods.setStorage, [address, slot, value])
    );
  }
  return Promise.all(prom);
}

async function insertTickContract(
  tickConfig: TickConfig,
  provider: JsonRpcProvider
) {
  const testnetConfig = tickConfig.testnetConfig;
  const contractConfig = tickConfig.tickContractConfig;

  if (!contractConfig.storage) {
    contractConfig.storage = {};
  }

  const owner =
    testnetConfig.addresses[0] || "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
  contractConfig.storage[
    "0x0000000000000000000000000000000000000000000000000000000000000000"
  ] = hexZeroPad(owner, 32);

  await Promise.all([
    setBalance(
      testnetConfig,
      provider,
      contractConfig.address,
      contractConfig.balance || "0x0"
    ),
    setCode(
      testnetConfig,
      provider,
      contractConfig.address,
      contractConfig.bytecode || "0x0"
    ),
    setStorage(
      testnetConfig,
      provider,
      contractConfig.address,
      contractConfig.storage
    ),
  ]);
}

async function insertSigner(tickConfig: TickConfig, provider: JsonRpcProvider) {
  await setBalance(
    tickConfig.testnetConfig,
    provider,
    tickConfig.signerConfig.address,
    tickConfig.signerConfig.balance || "0x0"
  );
}

function createSigner(
  signerConfig: SignerConfig,
  provider: JsonRpcProvider
): Wallet {
  return new Wallet(signerConfig.privateKey, provider);
}

async function createTickContract(
  tickConfig: TickConfig,
  provider: JsonRpcProvider
): Promise<Contract> {
  await Promise.all([
    insertTickContract(tickConfig, provider),
    insertSigner(tickConfig, provider),
  ]);
  const signer = createSigner(tickConfig.signerConfig, provider);
  const contractConfig = tickConfig.tickContractConfig;
  const contract = new Contract(
    contractConfig.address,
    contractConfig.abi,
    signer
  );
  return contract;
}

function createTickProvider(testnetConfig: TestnetConfig): JsonRpcProvider {
  return new JsonRpcProvider(`http://localhost:${testnetConfig.port}`);
}

async function tick(
  nonce: number,
  tickConfig: TickConfig,
  tickContract: Contract,
  logger: Logger
) {
  logger.info("ticking...");
  const basefee = (await tickContract.provider.getFeeData()).maxFeePerGas;
  const gasPrice = basefee?.mul(10);
  const txParams = { nonce, gasPrice, ...tickConfig.tickTxConfig };
  const tx = await tickContract.tick(txParams);
  const receipt = await tx.wait();
  logger.info("tick done");
  logger.info("bn", receipt.blockNumber);
  logger.info("txHash", receipt.transactionHash);
  logger.info("success", receipt.status === 1);
}

async function startTick(tickConfig: TickConfig, logger: Logger) {
  const provider = createTickProvider(tickConfig.testnetConfig);
  const tickContract = await createTickContract(tickConfig, provider);

  let nonce = await provider.getTransactionCount(
    tickConfig.signerConfig.address
  );
  let blockNumber = 0;

  // Subscribing to new blocks is not always reliable, so we poll for new blocks
  while (true) {
    const currentBlockNumber = await provider.getBlockNumber();
    if (currentBlockNumber <= blockNumber) {
      await sleep(50);
      continue;
    }
    blockNumber = currentBlockNumber;
    logger.info("new block", blockNumber);
    tick(nonce, tickConfig, tickContract, logger);
    nonce++;
    await sleep(500);
  }
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

function startCmdProc(cmd: Command, logger: Logger) {
  // const logPrefix = `[${command}]`;
  const logPrefix = null;
  logger = createLogger(logPrefix);
  const cmdProc = createCmdProcess(cmd);
  handleStd(cmdProc, logger);
  handleError(cmdProc, logger);
  handleClose(cmdProc, logger);
  handleNodeClose(cmdProc, logger);
  pipeSignal(cmdProc, logger);
}

function validateCmd(cmd: Command): Success {
  if (cmd.command === undefined) {
    return { ok: false, error: new Error("command is undefined") };
  }
  if (cmd.command.length == 0) {
    return { ok: false, error: new Error("command is empty") };
  }
  return { ok: true, error: null };
}

function extractCmd(argv: string[]): Command {
  let threshold: number;
  if (argv[0].endsWith("node")) {
    threshold = 2;
  } else {
    threshold = 2;
  }
  const command = argv[threshold];
  const options = argv.slice(threshold + 1);
  return { command, options };
}

function main() {
  const logger = createLogger();

  const cmd = extractCmd(process.argv);
  const { ok, error } = validateCmd(cmd);
  if (!ok) {
    console.error("invalid command:", error?.message);
    process.exit();
  }

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

  startCmdProc(cmd, logger);
  setTimeout(() => startTick(tickConfig, logger), 1000);
}

main();
