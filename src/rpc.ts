import { AddressStorage, TestnetConfig, RPCMethods } from "./types";

import { JsonRpcProvider } from "@ethersproject/providers";

function mustHaveMethods(testnetConfig: TestnetConfig): RPCMethods {
  if (!testnetConfig.methods) {
    throw new Error("Testnet config must have methods");
  }
  return testnetConfig.methods;
}

export function setCode(
  testnetConfig: TestnetConfig,
  provider: JsonRpcProvider,
  address: string,
  bytecode: string
): Promise<any> {
  const methods: RPCMethods = mustHaveMethods(testnetConfig);
  return provider.send(methods.setCode, [address, bytecode]);
}

export function setBalance(
  testnetConfig: TestnetConfig,
  provider: JsonRpcProvider,
  address: string,
  balance: string
): Promise<any> {
  const methods: RPCMethods = mustHaveMethods(testnetConfig);
  return provider.send(methods.setBalance, [address, balance]);
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
  const methods: RPCMethods = mustHaveMethods(testnetConfig);
  const prom: Promise<any>[] = [];
  for (const slot in storage) {
    const value = storage[slot];
    prom.push(provider.send(methods.setStorage, [address, slot, value]));
  }
  return Promise.all(prom);
}
