# MyToken DeFi - Airdrop & Staking

## Deployed version url:

https://final-project-

## How to run this project locally:

### Prerequisites

- Node.js >= v14
- Truffle and Ganache
- `git checkout master`

### Contracts

- Run `npm install` in project root to install Truffle build and smart contract dependencies
- Run local testnet in port `7545` with an Ethereum client, e.g. Ganache
- Before running test make sure to uncomment the part written in migrations/2_deply_contracts.js
- `truffle migrate --network development`
- Run tests in Truffle console: `test`
- `development` network id is 1337, remember to change it in Metamask as well!

### Frontend

- `cd app`
- `npm install`
- `cd src`
- `npm run dev`
- Open `http://localhost:8080`

### How to populate locally deployed contract with listings

- `truffle migrate --network development`
- `cd app\src && npm run dec`
- Open local ui from `http://localhost:8080`
- Make sure your Metamask localhost network is in port `7545` and chain id is `1337`.
- If you get `TXRejectedError` when sending a transaction, reset your Metamask account from Advanced settings.

## Screencast link

https://youtu.be/

## Public Ethereum wallet for certification:

`0x4F383b2d797499c5f91f59c9fa2A6d84ED9e6f31`

## Project description

Use this DeFi App to claim an Airdrop of MyToken and afterwards stake them into the Staking Contract.
You can unstake at any time.

First users claim the airdrop from the Airdrop site and the token balance is being updated.

Next step is to approve the Staking Contract to transfer your tokens, this is a prerequisite to use the staking function.
Currently there is no unstaking period, so Users can withdraw at any time.

- Tracking who claimed the airdrop so one address can claim only once.
- Stores tokenBalance internally in a mapping when tokens are being staked.
- With `unstake()` the tokens are being transferred back to the user.

## Simple workflow

1. Enter web site
2. Connect with Metamask
3. Claim airdrop
4. Switch to Staking
5. Approve Tokens to Staking Contract
6. Stake your Tokens
7. Unstake your Tokens

## Scheduled workflow for reward distribution (Not implemented)

1. Calculate rewards of each individual user
2. Implement function claimReward
3. Users call claimReward to get rewards

## Directory structure

- `app`: webpack.
- `client\src\contracts`: contracts in .json format
- `contracts`: Smart contracts that are deployed in the Ropsten testnet.
- `migrations`: Migration files for deploying contracts in `contracts` directory.
- `test`: Tests for smart contracts.

## Environment variables (not needed for running project locally)

```
ROPSTEN_INFURA_PROJECT_ID=
ROPSTEN_MNEMONIC=
```

## TODO features

- Rewards calculation
- Rewards distribution
- Lock time before unstake

