// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title Airdrop Contract
/// @author ethSplit
/// @notice Users can use this contract to claim tokens for free once per address
/// @dev The owner sets the token address and the claimable amount, so users can claim tokens, while a mapping checks if a user already claimed tokens.
contract Airdrop is Ownable, ReentrancyGuard{

    /// @notice Emitted when TokenAddress is being set
    /// @param setTokenAddress ERC20 TokenAddress
    event TokenAddressSet(address setTokenAddress);

    /// @notice Emitted when ClaimableAmount is being set
    /// @param claimableAmount amount to claim per user
    event ClaimableAmountSet(uint claimableAmount);

    /// @notice Emitted when Airdrop is being claimed
    /// @param caller user that claimed the airdrop
    /// @param amount that has been claimed
    event AirdropClaimed(address caller, uint amount);

    /// @notice used to store the token address
    /// @dev imported IERC20.sol from openzeppelin to store token address
    IERC20 public token;

    /// @notice Mapping used to check if users claimed already
    /// @dev sets the user that claims to true
    mapping (address => bool) claimed;

    /***
    todo Whitelist users
    /// @notice Checks if users are whitelisted
    /// @dev owner can set an address to true, if it is eligible for the airdrop
    mapping (address => bool) public whitelist;
    ***/

    /// @notice Amount of tokens to be claimed
    /// @dev uint that stores the claimable amount of tokens per user
    uint256 public claimableAmount;
    
    modifier isTokenSet() {
        require(token != IERC20(address(0)), "No token address set");
        _;
    }
    
    modifier claimableAmountSet () {
        require(claimableAmount > 0, "No calimable amount set");
        _;
    }

    /// @notice sets the tokenaddress the contract will use
    /// @dev adds the ERC20 Token address
    /// @param _tokenAddress for the Token that should be claimable
    function setTokenAddress (address _tokenAddress) external onlyOwner() {
        token = IERC20(_tokenAddress);
        emit TokenAddressSet(_tokenAddress);
    }

    /// @notice sets the amount of tokens that can be claimed per user
    /// @dev pass normal decimal number
    /// @param _amount the amount of tokens that should be claimable
    function setClaimableAmount (uint _amount) external onlyOwner() isTokenSet(){
        require(_amount > 0);
        claimableAmount = _amount;
        emit ClaimableAmountSet(claimableAmount);
    }

    /// @notice lets user claim the airdrop
    /// @dev check that a user can claim only once
    function claimAirdrop () external isTokenSet() claimableAmountSet() nonReentrant {
        /**todo only whitelisted users
        require(whitelist[msg.sender] == true);
        **/
        require(claimed[msg.sender] == false, "Airdrop has already been claimed");
        require(getBalance() >= claimableAmount, "Sorry, no tokens left!");
        require(token.transfer(msg.sender, claimableAmount), "Transfer was not successful");
        claimed[msg.sender] = true;
        emit AirdropClaimed(msg.sender, claimableAmount);
    }

    function getTokenAddress () public view returns(IERC20) {
        return token;
    }
    
    /// @notice returns the balance of this contract
    /// @dev returns token balance
    /// @return uint that stands for the token balance of this contract
    function getBalance () public view isTokenSet() returns(uint) {
        return token.balanceOf(address(this));
    }

    function getClaimableAmount () public view returns(uint) {
        return claimableAmount;
    }

     /***
    todo Add whitelist functionality
    function addToWhiteList (address _user) onlyOwner() {
        require (whitelist[_user] !=== false);
        whitelist[_user] == true;
    }
    ***/
    
}