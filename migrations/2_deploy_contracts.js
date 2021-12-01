var MyToken = artifacts.require("./MyToken.sol");
var Airdrop = artifacts.require("./Airdrop.sol");
var StakingContract = artifacts.require("./StakingContract.sol");

//require("dotenv").config({path: "../.env"});

module.exports = async function(deployer, network) {
  
  await deployer.deploy(MyToken, 10000000000000);
  await deployer.deploy(Airdrop);
  await deployer.deploy(StakingContract);
  let stakingInstance = await StakingContract.deployed();
  let tokenInstance = await MyToken.deployed();
  let airdropInstance = await Airdrop.deployed();
  /**uncomment for tests!
  //if (network == "development") return;
  */
  await airdropInstance.setTokenAddress(MyToken.address);
  await airdropInstance.setClaimableAmount(1);
  await stakingInstance.setStakingToken(MyToken.address);
  await tokenInstance.mint(Airdrop.address, 1000);
};
