var chai = require('chai');
var expect = chai.expect;

const { catchRevert } = require("./exceptionsHelpers.js");
const {
  BN,
  constants,
  //expect,
  expectEvent,
  expectRevert
} = require('@openzeppelin/test-helpers');

const StakingContract = artifacts.require("./StakingContract.sol");
const MyToken = artifacts.require("./MyToken.sol");
const Airdrop = artifacts.require("./Airdrop.sol");

contract("StakingContract", accounts => {

    const [deployerAccount, recipient, staker, unstaker, airdroper] = accounts;

    let myTokenInstance;
    let airdropInstance;
    let stakingContractInstance;

    beforeEach(async () => {
        myTokenInstance = await MyToken.new(1000);
        airdropInstance = await Airdrop.new();
        stakingContractInstance = await StakingContract.new();
    });
    
    it("should return token address", async () => {
        myTokenInstance = await MyToken.deployed();
        stakingContractInstance = await StakingContract.deployed();

        //READ DATA
        await stakingContractInstance.setStakingToken(MyToken.address, { from: deployerAccount });
        const tokenAddress = await stakingContractInstance.getStakingToken.call();

        //ASSERTION
        assert.equal(tokenAddress, MyToken.address, "should be the same addresses");
    });

    it("should revert unstake function as nothing was staked", async () => {
        myTokenInstance = await MyToken.deployed();
        stakingContractInstance = await StakingContract.deployed();
        airdropInstance = await Airdrop.deployed();

        //VALUES
        const claimAmount = 1;
        const stakeAmount = 1;

        //CONFIG
        await myTokenInstance.mint(Airdrop.address, 1000000, { from: deployerAccount});
        await stakingContractInstance.setStakingToken(MyToken.address, {from: deployerAccount});
        await airdropInstance.setTokenAddress(MyToken.address, { from: deployerAccount});
        await airdropInstance.setClaimableAmount(claimAmount, { from: deployerAccount});
        await airdropInstance.claimAirdrop({ from: recipient});

        //TEST CASE
        await myTokenInstance.approve(StakingContract.address, stakeAmount, { from: recipient});
        await catchRevert(stakingContractInstance.unstake(stakeAmount, { from: recipient}));
    });

    it("correct amount should be staked", async () => {

        myTokenInstance = await MyToken.deployed();
        stakingContractInstance = await StakingContract.deployed();
        airdropInstance = await Airdrop.deployed();

        //VALUES
        const claimAmount = 1;
        const stakeAmount = 1;

        //CONFIG
        await myTokenInstance.mint(Airdrop.address, 1000000, { from: deployerAccount});
        await stakingContractInstance.setStakingToken(MyToken.address, {from: deployerAccount});
        await airdropInstance.setTokenAddress(MyToken.address, { from: deployerAccount});
        await airdropInstance.setClaimableAmount(claimAmount, { from: deployerAccount});
        await airdropInstance.claimAirdrop({ from: staker});

        //TEST CASE
        await myTokenInstance.approve(StakingContract.address, stakeAmount, { from: staker});
        var result = await stakingContractInstance.stake(stakeAmount, { from: staker});

        //READ DATA
        const logStakeAmount = new BN(result.logs[0].args.stakedAmount);
        const getStakingAmount = await stakingContractInstance.getStake.call({ from: staker})

        //ASSERTION
        expect(logStakeAmount).to.be.a.bignumber.equal(getStakingAmount);

    });

    it("correct amount should be unstaked", async () => {
        myTokenInstance = await MyToken.deployed();
        stakingContractInstance = await StakingContract.deployed();
        airdropInstance = await Airdrop.deployed();

        //VALUES
        const claimAmount = 1;
        const stakeAmount = 1;

        //CONFIG
        await myTokenInstance.mint(Airdrop.address, 1000000, { from: deployerAccount});
        await stakingContractInstance.setStakingToken(MyToken.address, {from: deployerAccount});
        await airdropInstance.setTokenAddress(MyToken.address, { from: deployerAccount});
        await airdropInstance.setClaimableAmount(claimAmount, { from: deployerAccount});
        await airdropInstance.claimAirdrop({ from: unstaker});

        //TEST CASE
        await myTokenInstance.approve(StakingContract.address, stakeAmount, { from: unstaker});
        var stakeResult = await stakingContractInstance.stake(stakeAmount, { from: unstaker});
        var unstakeResult = await stakingContractInstance.unstake(stakeAmount, { from: unstaker});

        //READ DATA
        const logStakeAmount = new BN(stakeResult.logs[0].args.stakedAmount);
        const logUnstakeAmount = new BN(unstakeResult.logs[0].args.withdrawalAmount);
        var totalStake = logStakeAmount.sub(logUnstakeAmount);
        const getStakingAmount = await stakingContractInstance.getStake.call({ from: unstaker});

        //ASSERTION
        expect(totalStake).to.be.a.bignumber.equal(getStakingAmount);
    });

});