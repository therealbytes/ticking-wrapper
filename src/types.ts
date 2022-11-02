export type Address = { address: string };
export type Balance = { balance: string };
export type AddressStorage = { [slot: string]: string };

export type AddressBalance = Address & Balance;
export type ContractConfig = {
  abi: string[];
  bytecode?: string;
  storage?: AddressStorage;
} & AddressBalance;
// We derive the address from the private key
export type SignerConfig = { privateKey: string } & Balance;

export type TickTxConfig = { gasLimit?: number; gasPrice?: number };

export type TestnetConfig = {
  port: number;
  addresses: string[];
  methods: {
    setCode: string;
    setBalance: string;
    setStorage: string;
  };
};

export type TickConfig = {
  tickContractConfig: ContractConfig;
  tickTxConfig: TickTxConfig;
  testnetConfig: TestnetConfig;
  signerConfig: SignerConfig;
};

export type TestnetConfigs = { [id: string]: TestnetConfig };

export type Command = {
  command: string;
  options: string[];
};

export type Success = {
  ok: boolean;
  error: Error | null;
};
