import {
  ContractConfig,
  SignerConfig,
  TickTxConfig,
  TestnetConfigs,
} from "./types";

export const tickContractConfig: ContractConfig = {
  address: "0x42000000000000000000000000000000000000A0",
  abi: ["function tick()"],
  bytecode:
    "0x608060405234801561001057600080fd5b50600436106100885760003560e01c80638da5cb5b1161005b5780638da5cb5b146100d0578063d4b83992146100f5578063e591b28214610108578063f2fde38b1461012357600080fd5b80633eaf5d9f1461008d57806354fd4d5014610097578063715018a6146100b5578063776d1a01146100bd575b600080fd5b610095610136565b005b61009f61022c565b6040516100ac91906105c8565b60405180910390f35b6100956102cf565b6100956100cb3660046105fb565b6102e3565b6000546001600160a01b03165b6040516001600160a01b0390911681526020016100ac565b6001546100dd906001600160a01b031681565b6100dd73491e7508857914e87bdd106ae3f6b1a38d6dfb8181565b6100956101313660046105fb565b61030d565b3373491e7508857914e87bdd106ae3f6b1a38d6dfb81146101b05760405162461bcd60e51b815260206004820152602960248201527f5469636b3a206f6e6c7920746865206465706f7369746f72206163636f756e746044820152682063616e207469636b60b81b60648201526084015b60405180910390fd5b6001546001600160a01b03166101c257565b600160009054906101000a90046001600160a01b03166001600160a01b0316633eaf5d9f6040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561021257600080fd5b505af1158015610226573d6000803e3d6000fd5b50505050565b60606102577f0000000000000000000000000000000000000000000000000000000000000000610386565b6102807f0000000000000000000000000000000000000000000000000000000000000000610386565b6102a97f0000000000000000000000000000000000000000000000000000000000000001610386565b6040516020016102bb9392919061062b565b604051602081830303815290604052905090565b6102d7610419565b6102e16000610473565b565b6102eb610419565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b610315610419565b6001600160a01b03811661037a5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016101a7565b61038381610473565b50565b60606000610393836104c3565b600101905060008167ffffffffffffffff8111156103b3576103b3610685565b6040519080825280601f01601f1916602001820160405280156103dd576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a85049450846103e757509392505050565b6000546001600160a01b031633146102e15760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016101a7565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b83106105025772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef8100000000831061052e576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc10000831061054c57662386f26fc10000830492506010015b6305f5e1008310610564576305f5e100830492506008015b612710831061057857612710830492506004015b6064831061058a576064830492506002015b600a8310610596576001015b92915050565b60005b838110156105b757818101518382015260200161059f565b838111156102265750506000910152565b60208152600082518060208401526105e781604085016020870161059c565b601f01601f19169190910160400192915050565b60006020828403121561060d57600080fd5b81356001600160a01b038116811461062457600080fd5b9392505050565b6000845161063d81846020890161059c565b8083019050601760f91b808252855161065d816001850160208a0161059c565b6001920191820152835161067881600284016020880161059c565b0160020195945050505050565b634e487b7160e01b600052604160045260246000fdfea26469706673582212201876c90c3c62523bde2be61f4240539bfdd547f0c73ceb132ccc0a9c909205fa64736f6c634300080f0033",
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
  address: "0x491E7508857914E87Bdd106Ae3f6B1a38D6DfB81",
  balance: "0x200000000000000000000000000000000000000000000000000000000000000",
};

export const tickTxConfig: TickTxConfig = {
  gasLimit: 1000000,
};

export const testnetConfigs: TestnetConfigs = {
  anvil: {
    addresses: ["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"],
    port: 8545,
    methods: {
      setCode: "anvil_setCode",
      setBalance: "anvil_setBalance",
      setStorage: "anvil_setStorageAt",
    },
  },
};
