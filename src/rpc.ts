import { AddressStorage, TestnetConfig } from "./types";

import { JsonRpcProvider } from "@ethersproject/providers";

export function setCode(
  testnetConfig: TestnetConfig,
  provider: JsonRpcProvider,
  address: string,
  bytecode: string
): Promise<any> {
  return provider.send(testnetConfig.methods.setCode, [address, bytecode]);
}

export function setBalance(
  testnetConfig: TestnetConfig,
  provider: JsonRpcProvider,
  address: string,
  balance: string
): Promise<any> {
  return provider.send(testnetConfig.methods.setBalance, [address, balance]);
}

export function setStorage(
  testnetConfig: TestnetConfig,
  provider: JsonRpcProvider,
  address: string,
  storage?: AddressStorage
): Promise<any> {
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
