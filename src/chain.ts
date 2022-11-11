import { setBalance, setCode, setStorage } from "./rpc";

import { JsonRpcProvider, WebSocketProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { Contract, EventFilter } from "@ethersproject/contracts";
import { id } from "@ethersproject/hash";
import { hexZeroPad } from "@ethersproject/bytes";
import { TickConfig } from "./types";

export function createTickProvider(tickConfig: TickConfig): JsonRpcProvider {
  const host = tickConfig.tickCmdOptions.host;
  const port = tickConfig.testnetConfig.port;
  if (host.startsWith("ws://") || host.startsWith("wss://")) {
    return new WebSocketProvider(`${host}:${port}`);
  }
  if (host.startsWith("http://") || host.startsWith("https://")) {
    return new JsonRpcProvider(`${host}:${port}`);
  }
  if (tickConfig.testnetConfig.websocket) {
    return new WebSocketProvider(`ws://${host}:${port}`);
  } else {
    return new JsonRpcProvider(`http://${host}:${port}`);
  }
}

export async function createSigner(
  tickConfig: TickConfig,
  provider: JsonRpcProvider
): Promise<Wallet> {
  const wallet = new Wallet(tickConfig.signerConfig.privateKey, provider);
  await insertSigner(wallet.address, tickConfig, provider);
  return wallet;
}

async function insertSigner(
  address: string,
  tickConfig: TickConfig,
  provider: JsonRpcProvider
) {
  await setBalance(
    tickConfig.testnetConfig,
    provider,
    address,
    tickConfig.signerConfig.balance || "0x0"
  );
}

export async function createTickContract(
  signer: Wallet,
  owner: string,
  tickConfig: TickConfig,
  provider: JsonRpcProvider
): Promise<Contract> {
  await insertTickContract(owner, tickConfig, provider);
  const contractConfig = tickConfig.tickContractConfig;
  const contract = new Contract(
    contractConfig.address,
    contractConfig.abi,
    signer
  );
  return contract;
}

async function insertTickContract(
  owner: string,
  tickConfig: TickConfig,
  provider: JsonRpcProvider
) {
  const testnetConfig = tickConfig.testnetConfig;
  const contractConfig = tickConfig.tickContractConfig;

  if (!contractConfig.storage) {
    contractConfig.storage = {};
  }
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

export function createErrorFilter(tickContract: Contract): EventFilter {
  return {
    address: tickContract.address,
    topics: [[id("TickError(string)"), id("TickError(bytes)")]],
  };
}
