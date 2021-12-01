# Contract security measures

## SWC-101 (Integer Overflow and Underflow)

All mathematical operations are used with `SafeMath` Library from OpenZeppelin.

## SWC-105 (Unprotected Ether Withdrawal)

`mint` is protected with OpenZeppelin `Ownable`'s `onlyOwner` modifier.

## SWC-104 (Unchecked Call Return Value)

The return value from a call to the owner's address in `claimAirdrop`, `stake` and `unstake` are checked with `require` to ensure transaction rollback if call fails.

## Modifiers used only for validation

All modifiers in contract(s) only validate data with `require` statements.