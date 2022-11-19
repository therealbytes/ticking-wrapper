import { TickConfig } from "./types";
import { Logger } from "./logger";
import {
  createTickProvider,
  createTickContract,
  createErrorFilter,
  createSigner,
} from "./chain";

import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider, WebSocketProvider } from "@ethersproject/providers";
import { toUtf8String } from "@ethersproject/strings";
import { BigNumber } from "@ethersproject/bignumber";

function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function tick(
  nonce: number,
  tickConfig: TickConfig,
  tickContract: Contract,
  logger: Logger
) {
  logger.info("ticking...");
  const minBasefee = BigNumber.from(1);
  let basefee = (await tickContract.provider.getFeeData()).maxFeePerGas || minBasefee;
  basefee = basefee.lt(minBasefee) ? minBasefee : basefee;
  const gasPrice = basefee.mul(10);
  const txParams = { nonce, gasPrice, ...tickConfig.tickTxConfig };
  const tx = await tickContract.tick(txParams);
  const receipt = await tx.wait();
  logger.info(
    "ticking done",
    "\n\tBN:",
    receipt.blockNumber,
    "\n\ttxHash:",
    receipt.transactionHash,
    "\n\tsuccess:",
    receipt.status === 1
  );
}

export async function startTick(tickConfig: TickConfig, logger: Logger) {
  const provider = createTickProvider(tickConfig);
  const signer = await createSigner(tickConfig, provider);
  const owner = await getOwnerAddress(tickConfig, provider);
  const tickContract = await createTickContract(
    signer,
    owner,
    tickConfig,
    provider
  );
  const errorFilter = createErrorFilter(tickContract);

  tickContract.on(errorFilter, (event) => {
    const reason = toUtf8String(event.data);
    logger.info("error calling target tick function:", reason);
  });

  let nonce = await provider.getTransactionCount(signer.address);
  let blockNumber = 0;

  const wTick = (blockNumber: number) => {
    logger.info("new block", blockNumber);
    tick(nonce, tickConfig, tickContract, logger);
    nonce++;
  };

  if (provider instanceof WebSocketProvider) {
    provider.on("block", async (blockNumber) => wTick(blockNumber));
  } else {
    while (true) {
      // Subscribing to new blocks is not reliable, so we poll for new blocks
      let currentBlockNumber: number = 0;
      try {
        currentBlockNumber = await provider.getBlockNumber();
      } catch (error) {
        logger.error("error getting block number:", error);
      }
      if (currentBlockNumber <= blockNumber) {
        await sleep(100);
        continue;
      }
      blockNumber = currentBlockNumber;
      wTick(blockNumber);
      await sleep(500);
    }
  }
}

async function getOwnerAddress(
  tickConfig: TickConfig,
  provider: JsonRpcProvider
): Promise<string> {
  const signer0 = provider.getSigner(0);
  const signer0Addr = await signer0.getAddress();
  if (!signer0Addr) {
    const configAddr0 = tickConfig.testnetConfig.addresses[0];
    if (!configAddr0) {
      return "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
    }
    return configAddr0;
  }
  return signer0Addr;
}
