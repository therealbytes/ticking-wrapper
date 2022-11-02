# Ticking wrapper

Wrap an ethereum devnet node to emulate a ticking chain.

Install

`yarn add --dev @therealbytes/ticking-wrapper`

Start chain

`npx ticking anvil # <anvil command line parameters>`

Set the tick target (must follow the tick interface)

```bash
cast send \
    --private-key ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
    0x42000000000000000000000000000000000000A0 \
    'setTarget(address)' \
    <CONTRACT_ADDRESS>
```

Every block will include a transaction calling `tick()` in the tick pre-deploy, which will call `tick()` in the target contract if it is set.

### Supported nodes:

- Anvil
- Hardhat (_coming soon_)

### More

Tick interface

```solidity
interface ITick {
  function tick() external;
}
```
