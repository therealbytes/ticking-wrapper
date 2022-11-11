import {
  TickCmdOptions,
  ContractConfig,
  SignerConfig,
  TickTxConfig,
  TestnetConfigs,
} from "./types";

export const tickCmdOptions: TickCmdOptions = {
  log: {
    muteList: [],
  },
  host: "localhost",
  hollow: false,
};

export const tickContractConfig: ContractConfig = {
  address: "0x42000000000000000000000000000000000000A0",
  abi: ["event TickError(string)", "event TickError(bytes)", "function tick()"],
  bytecode:
    "0x608060405234801561001057600080fd5b50600436106100885760003560e01c80638da5cb5b1161005b5780638da5cb5b146100d0578063d4b839921461010f578063e591b2821461012f578063f2fde38b1461014a57600080fd5b80633eaf5d9f1461008d57806354fd4d5014610097578063715018a6146100b5578063776d1a01146100bd575b600080fd5b61009561015d565b005b61009f610367565b6040516100ac91906107cf565b60405180910390f35b61009561040a565b6100956100cb3660046107e9565b61041c565b60005473ffffffffffffffffffffffffffffffffffffffff165b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100ac565b6001546100ea9073ffffffffffffffffffffffffffffffffffffffff1681565b6100ea73491e7508857914e87bdd106ae3f6b1a38d6dfb8181565b6100956101583660046107e9565b61046b565b3373491e7508857914e87bdd106ae3f6b1a38d6dfb8114610205576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f5469636b3a206f6e6c7920746865206465706f7369746f72206163636f756e7460448201527f2063616e207469636b000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b60015473ffffffffffffffffffffffffffffffffffffffff1661022457565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633eaf5d9f6040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561028e57600080fd5b505af192505050801561029f575060015b610365576102ab61081f565b806308c379a00361030457506102bf6108dc565b806102ca5750610306565b7fb5ea3e4e4e5ceb1be82023f6021b8d830c2cb8cf28fdc22fd877b8340972c1ec816040516102f991906107cf565b60405180910390a150565b505b3d808015610330576040519150601f19603f3d011682016040523d82523d6000602084013e610335565b606091505b507f8d9b342a183bb7b95256c9aa8c59d9f11f7ab9ddd4d0888ccea216568fb1c346816040516102f991906107cf565b565b60606103927f0000000000000000000000000000000000000000000000000000000000000000610522565b6103bb7f0000000000000000000000000000000000000000000000000000000000000000610522565b6103e47f0000000000000000000000000000000000000000000000000000000000000000610522565b6040516020016103f693929190610984565b604051602081830303815290604052905090565b61041261065f565b61036560006106e0565b61042461065f565b600180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff92909216919091179055565b61047361065f565b73ffffffffffffffffffffffffffffffffffffffff8116610516576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084016101fc565b61051f816106e0565b50565b60608160000361056557505060408051808201909152600181527f3000000000000000000000000000000000000000000000000000000000000000602082015290565b8160005b811561058f578061057981610a29565b91506105889050600a83610a90565b9150610569565b60008167ffffffffffffffff8111156105aa576105aa61083b565b6040519080825280601f01601f1916602001820160405280156105d4576020820181803683370190505b5090505b8415610657576105e9600183610aa4565b91506105f6600a86610abb565b610601906030610acf565b60f81b81838151811061061657610616610ae7565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350610650600a86610a90565b94506105d8565b949350505050565b60005473ffffffffffffffffffffffffffffffffffffffff163314610365576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016101fc565b6000805473ffffffffffffffffffffffffffffffffffffffff8381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60005b83811015610770578181015183820152602001610758565b8381111561077f576000848401525b50505050565b6000815180845261079d816020860160208601610755565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b6020815260006107e26020830184610785565b9392505050565b6000602082840312156107fb57600080fd5b813573ffffffffffffffffffffffffffffffffffffffff811681146107e257600080fd5b600060033d11156108385760046000803e5060005160e01c5b90565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f830116810181811067ffffffffffffffff821117156108d5577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040525050565b600060443d10156108ea5790565b6040517ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc803d016004833e81513d67ffffffffffffffff816024840111818411171561093857505050505090565b82850191508151818111156109505750505050505090565b843d870101602082850101111561096a5750505050505090565b6109796020828601018761086a565b509095945050505050565b60008451610996818460208901610755565b80830190507f2e0000000000000000000000000000000000000000000000000000000000000080825285516109d2816001850160208a01610755565b600192019182015283516109ed816002840160208801610755565b0160020195945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203610a5a57610a5a6109fa565b5060010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600082610a9f57610a9f610a61565b500490565b600082821015610ab657610ab66109fa565b500390565b600082610aca57610aca610a61565b500690565b60008219821115610ae257610ae26109fa565b500190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fdfea164736f6c634300080f000a",
  balance: "0x0",
  storage: {
    "0x0000000000000000000000000000000000000000000000000000000000000000":
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000000000000000000000000001":
      "0x0000000000000000000000000000000000000000000000000000000000000000",
  },
};

export const signerConfig: SignerConfig = {
  privateKey:
    "0x1111111100000000000000000000000000000000000000000000000000000000",
  balance: "0x200000000000000000000000000000000000000000000000000000000000000",
};

export const tickTxConfig: TickTxConfig = {
  gasLimit: 1000000,
};

export const testnetConfigs: TestnetConfigs = {
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
