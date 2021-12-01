# Design patterns used

## Access Control Design Patterns

- `Ownable` design pattern used in all three contracts in the functions: `setTokenAddress` and `setClaimableAmount` in "Airdrop.sol",`mint()` in "MyToken.sol", `setStakingToken` in "StakingContract.sol". These functions do not need to be used by anyone else apart from the contract creator, i.e. the party that is responsible for managing the smart contracts.

## Inheritance and Interfaces

- `MyToken` contract inherits the OpenZeppelin `ERC20` contract to enable have the ERC20Token functionality.