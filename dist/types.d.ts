export declare type AddressStorage = {
    [slot: string]: string;
};
export declare type AddressConfig = {
    address: string;
};
export declare type BalanceConfig = {
    balance?: string;
} & AddressConfig;
export declare type ContractConfig = {
    abi: string[];
    bytecode?: string;
    storage?: AddressStorage;
} & BalanceConfig;
export declare type SignerConfig = {
    privateKey: string;
} & BalanceConfig;
export declare type TickTxConfig = {
    gasLimit?: number;
    gasPrice?: number;
};
export declare type TestnetConfig = {
    port: number;
    addresses: string[];
    methods: {
        setCode: string;
        setBalance: string;
        setStorage: string;
    };
};
export declare type TickConfig = {
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
