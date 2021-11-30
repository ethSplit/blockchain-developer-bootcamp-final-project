// var chai = require('chai');
// var expect = chai.expect;


// const { catchRevert } = require("./exceptionsHelpers.js");
// const {
//   BN,
//   constants,
//   //expect,
//   expectEvent,
//   expectRevert
// } = require('@openzeppelin/test-helpers');
// const { assert } = require('console');

// const MyToken = artifacts.require("./MyToken.sol");

// contract("MyToken", accounts => {

//     let myTokenInstance;

//     const [deployerAccount, recipient, staker, unstaker, airdroper, beneficiary] = accounts;

//     beforeEach(async() => {
//         myTokenInstance = await MyToken.new(1);
//     });

//      it("should return minted tokens", async () => {
//          assert.equal log.amount and balanceOf(recipient)
//      }); 

//      it("should send correct amount", async () => {
//          assert.equal log.transfer and balanceOf(beneficiary)
//      });

//      it("should revert when sending more tokens than available in balance", async () => {
//          catchRevert myTokenInstance.transfer( beneficiary ,balanceOf(deployed)+1);
//      });

// });