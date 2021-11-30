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

const Airdrop = artifacts.require("./Airdrop.sol");
const MyToken = artifacts.require("./MyToken.sol");

contract("Airdrop", accounts => {

  const [deployerAccount, recipient, staker, unstaker, airdroper] = accounts;

  let myTokenInstance;
  let airdropInstance;

  beforeEach(async () => {
    myTokenInstance = await MyToken.new(10);
    airdropInstance = await Airdrop.new();
  });
  
  it("airdrop balance should return 0", async () => {
    airdropInstance = await Airdrop.new();
    airdropInstance = await Airdrop.deployed();
    myTokenInstance = await MyToken.deployed();

    //VALUES
    const expectedValue = 0;

    //READ
    const balance = await myTokenInstance.balanceOf(Airdrop.address);
    
    //ASSERTION
    assert.equal(balance, expectedValue, "should be the same values");
  });

  it("should throw error", async () => {
    airdropInstance = await Airdrop.deployed();
    myTokenInstance = await MyToken.deployed();

    //WRITE
    await myTokenInstance.mint(Airdrop.address, 1000000);

    //CATCH
    await catchRevert(airdropInstance.claimAirdrop({from: deployerAccount}));
  });
  
  it("should set correct token address", async () => {
    airdropInstance = await Airdrop.deployed();
    myTokenInstance = await MyToken.deployed();

    //WRITE
    await airdropInstance.setTokenAddress(MyToken.address, { from: deployerAccount });
    const tokenAddress = await airdropInstance.getTokenAddress.call();

    assert.equal(tokenAddress, MyToken.address, "The addresses should be equal");
  });

  it("checks the claimable amount", async () => {
    airdropInstance = await Airdrop.deployed();
    myTokenInstance = await MyToken.deployed();

    //VALUES
    const setClaimableAmount = 10;
    
    //WRITE
    await airdropInstance.setTokenAddress(MyToken.address, { from: deployerAccount });
    var result = await airdropInstance.setClaimableAmount(setClaimableAmount, { from: deployerAccount});

    //READ
    const expectedAmount = await airdropInstance.getClaimableAmount.call();
    const claimableAmount = new BN(result.logs[0].args.claimableAmount);

    //CHECK
    expect(claimableAmount).to.be.a.bignumber.equal(expectedAmount);
  })

  it("returns the exact amount of minted tokens for the airdrop contract", async () => {
    airdropInstance = await Airdrop.deployed();
    myTokenInstance = await MyToken.deployed();

    //VALUES
    const tokenAmount = new BN(1000);

    //WRITE
    await airdropInstance.setTokenAddress(MyToken.address);
    var result = await myTokenInstance.mint(Airdrop.address, tokenAmount, { from: deployerAccount });

    //READ
    const logBalance = new BN(result.logs[0].args.value);

    //CHECK
    expect(tokenAmount).to.be.a.bignumber.equal(logBalance);
  });

  it("should claim correct amount", async () => {

    myTokenInstance = await MyToken.deployed();
    airdropInstance = await Airdrop.deployed();

    const claimAmount = new BN(1);

    //WRITE
    await myTokenInstance.mint(Airdrop.address, 10000000000000, { from: deployerAccount });
    await airdropInstance.setTokenAddress(MyToken.address, { from: deployerAccount });
    await airdropInstance.setClaimableAmount(claimAmount, { from: deployerAccount });

    //TEST CASE
    var result = await airdropInstance.claimAirdrop({ from: airdroper });

    //READ
    const claimedAmount = new BN(result.logs[0].args.amount);
    const newBalance = await myTokenInstance.balanceOf(airdroper);

    //ASSERTION
    expect(newBalance).to.be.a.bignumber.equal(claimedAmount);
  });

});
