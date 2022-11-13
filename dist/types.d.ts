export declare type Address = {
    address: string;
};
export declare type Balance = {
    balance: string;
};
export declare type AddressStorage = {
    [slot: string]: string;
};
export declare type AddressBalance = Address & Balance;
export declare type ContractConfig = {
    abi: string[];
    bytecode?: string;
    storage?: AddressStorage;
} & AddressBalance;
export declare type SignerConfig = {
    privateKey: string;
} & Balance;
export declare type TickCmdOptions = {
    log: {
        muteList: string[];
    };
    host: string;
    hollow: boolean;
};
export declare type TickTxConfig = {
    gasLimit?: number;
    gasPrice?: number;
};
export declare type RPCMethods = {
    setCode: string;
    setBalance: string;
    setStorage: string;
};
export declare type TestnetConfig = {
    genesis: boolean;
    websocket: boolean;
    port: number;
    addresses: string[];
    methods?: RPCMethods;
};
export declare type TickConfig = {
    tickCmdOptions: TickCmdOptions;
    tickContractConfig: ContractConfig;
    tickTxConfig: TickTxConfig;
    testnetConfig: TestnetConfig;
    signerConfig: SignerConfig;
};
export declare type TestnetConfigs = {
    [id: string]: TestnetConfig;
};
export declare type Command = {
    command: string;
    options: string[];
};
export declare type Success = {
    ok: boolean;
    error: Error | null;
};
