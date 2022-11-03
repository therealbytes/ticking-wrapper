#!/usr/bin/env node
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { Contract } from '@ethersproject/contracts';
import { id } from '@ethersproject/hash';
import { hexZeroPad } from '@ethersproject/bytes';
import { toUtf8String } from '@ethersproject/strings';
import { spawn } from 'child_process';

const tickCmdOptions = {
    log: {
        muteList: [],
    },
    host: "localhost",
};
const tickContractConfig = {
    address: "0x42000000000000000000000000000000000000A0",
    abi: ["event TickError(string)", "event TickError(bytes)", "function tick()"],
    bytecode: "0x608060405234801561001057600080fd5b50600436106100885760003560e01c80638da5cb5b1161005b5780638da5cb5b146100d0578063d4b839921461010f578063e591b2821461012f578063f2fde38b1461014a57600080fd5b80633eaf5d9f1461008d57806354fd4d5014610097578063715018a6146100b5578063776d1a01146100bd575b600080fd5b61009561015d565b005b61009f610367565b6040516100ac91906107cf565b60405180910390f35b61009561040a565b6100956100cb3660046107e9565b61041c565b60005473ffffffffffffffffffffffffffffffffffffffff165b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100ac565b6001546100ea9073ffffffffffffffffffffffffffffffffffffffff1681565b6100ea73491e7508857914e87bdd106ae3f6b1a38d6dfb8181565b6100956101583660046107e9565b61046b565b3373491e7508857914e87bdd106ae3f6b1a38d6dfb8114610205576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f5469636b3a206f6e6c7920746865206465706f7369746f72206163636f756e7460448201527f2063616e207469636b000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b60015473ffffffffffffffffffffffffffffffffffffffff1661022457565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633eaf5d9f6040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561028e57600080fd5b505af192505050801561029f575060015b610365576102ab61081f565b806308c379a00361030457506102bf6108dc565b806102ca5750610306565b7fb5ea3e4e4e5ceb1be82023f6021b8d830c2cb8cf28fdc22fd877b8340972c1ec816040516102f991906107cf565b60405180910390a150565b505b3d808015610330576040519150601f19603f3d011682016040523d82523d6000602084013e610335565b606091505b507f8d9b342a183bb7b95256c9aa8c59d9f11f7ab9ddd4d0888ccea216568fb1c346816040516102f991906107cf565b565b60606103927f0000000000000000000000000000000000000000000000000000000000000000610522565b6103bb7f0000000000000000000000000000000000000000000000000000000000000000610522565b6103e47f0000000000000000000000000000000000000000000000000000000000000000610522565b6040516020016103f693929190610984565b604051602081830303815290604052905090565b61041261065f565b61036560006106e0565b61042461065f565b600180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff92909216919091179055565b61047361065f565b73ffffffffffffffffffffffffffffffffffffffff8116610516576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084016101fc565b61051f816106e0565b50565b60608160000361056557505060408051808201909152600181527f3000000000000000000000000000000000000000000000000000000000000000602082015290565b8160005b811561058f578061057981610a29565b91506105889050600a83610a90565b9150610569565b60008167ffffffffffffffff8111156105aa576105aa61083b565b6040519080825280601f01601f1916602001820160405280156105d4576020820181803683370190505b5090505b8415610657576105e9600183610aa4565b91506105f6600a86610abb565b610601906030610acf565b60f81b81838151811061061657610616610ae7565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350610650600a86610a90565b94506105d8565b949350505050565b60005473ffffffffffffffffffffffffffffffffffffffff163314610365576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016101fc565b6000805473ffffffffffffffffffffffffffffffffffffffff8381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60005b83811015610770578181015183820152602001610758565b8381111561077f576000848401525b50505050565b6000815180845261079d816020860160208601610755565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b6020815260006107e26020830184610785565b9392505050565b6000602082840312156107fb57600080fd5b813573ffffffffffffffffffffffffffffffffffffffff811681146107e257600080fd5b600060033d11156108385760046000803e5060005160e01c5b90565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f830116810181811067ffffffffffffffff821117156108d5577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040525050565b600060443d10156108ea5790565b6040517ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc803d016004833e81513d67ffffffffffffffff816024840111818411171561093857505050505090565b82850191508151818111156109505750505050505090565b843d870101602082850101111561096a5750505050505090565b6109796020828601018761086a565b509095945050505050565b60008451610996818460208901610755565b80830190507f2e0000000000000000000000000000000000000000000000000000000000000080825285516109d2816001850160208a01610755565b600192019182015283516109ed816002840160208801610755565b0160020195945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203610a5a57610a5a6109fa565b5060010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600082610a9f57610a9f610a61565b500490565b600082821015610ab657610ab66109fa565b500390565b600082610aca57610aca610a61565b500690565b60008219821115610ae257610ae26109fa565b500190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fdfea164736f6c634300080f000a",
    balance: "0x0",
    storage: {
        "0x0000000000000000000000000000000000000000000000000000000000000000": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000001": "0x0000000000000000000000000000000000000000000000000000000000000000",
    },
};
const signerConfig = {
    privateKey: "0x1111111100000000000000000000000000000000000000000000000000000000",
    balance: "0x200000000000000000000000000000000000000000000000000000000000000",
};
const tickTxConfig = {
    gasLimit: 1000000,
};
const testnetConfigs = {
    anvil: {
        addresses: [],
        port: 8545,
        methods: {
            setCode: "anvil_setCode",
            setBalance: "anvil_setBalance",
            setStorage: "anvil_setStorageAt",
        },
    },
};

function createFilterFunc(muteList) {
    return (...args) => {
        if (!args || args.length == 0) {
            return false;
        }
        // return !args.some((arg) => muteList.includes(arg));
        return !muteList.some((muteWord) => args[0].startsWith(muteWord));
    };
}
function createLogFunc(logPrefix, consoleFunc) {
    const logPrefixArray = logPrefix ? [logPrefix] : [];
    return (...args) => {
        consoleFunc(...logPrefixArray, ...args);
    };
}
function createFilteredLogFunc(filterFunc, logFunc) {
    return (...args) => {
        if (filterFunc(...args)) {
            logFunc(...args);
        }
    };
}
function createLogger(logPrefix = null, muteList = []) {
    const filterFunc = createFilterFunc(muteList);
    return {
        info: createFilteredLogFunc(filterFunc, createLogFunc(logPrefix, console.info)),
        warning: createFilteredLogFunc(filterFunc, createLogFunc(logPrefix, console.warn)),
        error: createFilteredLogFunc(filterFunc, createLogFunc(logPrefix, console.error)),
    };
}

function setCode(testnetConfig, provider, address, bytecode) {
    return provider.send(testnetConfig.methods.setCode, [address, bytecode]);
}
function setBalance(testnetConfig, provider, address, balance) {
    return provider.send(testnetConfig.methods.setBalance, [address, balance]);
}
function setStorage(testnetConfig, provider, address, storage) {
    if (!storage) {
        return Promise.resolve();
    }
    const prom = [];
    for (const slot in storage) {
        const value = storage[slot];
        prom.push(provider.send(testnetConfig.methods.setStorage, [address, slot, value]));
    }
    return Promise.all(prom);
}

function createTickProvider(tickConfig) {
    return new JsonRpcProvider(`http://${tickConfig.tickCmdOptions.host}:${tickConfig.testnetConfig.port}`);
}
async function createSigner(tickConfig, provider) {
    const wallet = new Wallet(tickConfig.signerConfig.privateKey, provider);
    await insertSigner(wallet.address, tickConfig, provider);
    return wallet;
}
async function insertSigner(address, tickConfig, provider) {
    await setBalance(tickConfig.testnetConfig, provider, address, tickConfig.signerConfig.balance || "0x0");
}
async function createTickContract(signer, owner, tickConfig, provider) {
    await insertTickContract(owner, tickConfig, provider);
    const contractConfig = tickConfig.tickContractConfig;
    const contract = new Contract(contractConfig.address, contractConfig.abi, signer);
    return contract;
}
async function insertTickContract(owner, tickConfig, provider) {
    const testnetConfig = tickConfig.testnetConfig;
    const contractConfig = tickConfig.tickContractConfig;
    if (!contractConfig.storage) {
        contractConfig.storage = {};
    }
    contractConfig.storage["0x0000000000000000000000000000000000000000000000000000000000000000"] = hexZeroPad(owner, 32);
    await Promise.all([
        setBalance(testnetConfig, provider, contractConfig.address, contractConfig.balance || "0x0"),
        setCode(testnetConfig, provider, contractConfig.address, contractConfig.bytecode || "0x0"),
        setStorage(testnetConfig, provider, contractConfig.address, contractConfig.storage),
    ]);
}
function createErrorFilter(tickContract) {
    return {
        address: tickContract.address,
        topics: [[id("TickError(string)"), id("TickError(bytes)")]],
    };
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function tick(nonce, tickConfig, tickContract, logger) {
    logger.info("ticking...");
    const basefee = (await tickContract.provider.getFeeData()).maxFeePerGas;
    const gasPrice = basefee === null || basefee === void 0 ? void 0 : basefee.mul(10);
    const txParams = { nonce, gasPrice, ...tickConfig.tickTxConfig };
    const tx = await tickContract.tick(txParams);
    const receipt = await tx.wait();
    logger.info("ticking done", "\n\tBN:", receipt.blockNumber, "\n\ttxHash:", receipt.transactionHash, "\n\tsuccess:", receipt.status === 1);
}
async function startTick(tickConfig, logger) {
    const provider = createTickProvider(tickConfig);
    const signer = await createSigner(tickConfig, provider);
    const owner = await getOwnerAddress(tickConfig, provider);
    const tickContract = await createTickContract(signer, owner, tickConfig, provider);
    const errorFilter = createErrorFilter(tickContract);
    tickContract.on(errorFilter, (event) => {
        const reason = toUtf8String(event.data);
        logger.info("error calling target tick function:", reason);
    });
    let nonce = await provider.getTransactionCount(signer.address);
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
async function getOwnerAddress(tickConfig, provider) {
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

function startCmdProc(cmd, logger) {
    const cmdProc = createCmdProcess(cmd);
    handleStd(cmdProc, logger);
    handleError(cmdProc, logger);
    handleClose(cmdProc, logger);
    handleNodeClose(cmdProc);
    pipeSignal(cmdProc);
}
function createCmdProcess(cmd) {
    return spawn(cmd.command, cmd.options);
}
function handleStd(proc, logger) {
    var _a, _b;
    (_a = proc.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
        logger.info(data.toString());
    });
    (_b = proc.stderr) === null || _b === void 0 ? void 0 : _b.on("data", (data) => {
        logger.warning(data.toString());
    });
}
function handleError(proc, logger) {
    proc.on("error", (error) => {
        logger.error(error.message);
    });
}
function handleClose(proc, logger) {
    proc.on("close", (code) => {
        logger.info("\ncommand subprocess exited with code", code);
        process.exit();
    });
}
function handleNodeClose(proc, logger) {
    process.on("exit", () => {
        proc.kill("SIGINT");
    });
}
function pipeSignal(proc, logger) {
    process.on("SIGINT", () => {
        proc.kill("SIGINT");
    });
}

export { createLogger, signerConfig, startCmdProc, startTick, testnetConfigs, tick, tickCmdOptions, tickContractConfig, tickTxConfig };
//# sourceMappingURL=index.js.map
