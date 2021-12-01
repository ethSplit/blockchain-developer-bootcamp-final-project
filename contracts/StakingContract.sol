// SPDX-License-Identifier: MITs
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title Staking Contract
/// @author ethSplit
/// @notice An implementation of a Staking Contract, to stake a Token
/// @dev stake token into contract and get added to mapping that checks stakes
contract StakingContract is Ownable, ReentrancyGuard {

  using SafeMath for uint;

  /// @notice Emitted when Token address is set
  /// @param from address that transacted this transaction
  /// @param tokenAddress ERC20 token address
  event TokenAddressSet (address from, address tokenAddress);

  /// @notice Emitted when someone stakes to this contract
  /// @param sender address called this function
  /// @param stakedAmount amount that has been staked
  event Staked (address sender, uint stakedAmount);

  /// @notice Emitted when someone unstakes from this contract
  /// @param sender address that called this function
  /// @param withdrawalAmount amount that has been unstaked
  event Unstaked (address sender, uint withdrawalAmount);

  /// todo make use of this state variable for stakeholder Array
  uint public stakeholderCount = 0;


  /// @notice Stores token address that is used for staking
  /// @dev ERC20 token address
  IERC20 public stakingToken;

  /// @notice Stores the stake for each address
  /// @dev mapping that stores balance that is being staked by each address
  mapping (address => uint256) internal stakes;

  /// todo add reward functionality
  mapping(address => uint256) internal rewards;

  /// todo add stakeholders for reward functionality
  address[] stakeholders;

  //todo: add timelock to make withdraw unable for this time
  uint256 public defaultLockInDuration;
  
  /// @notice checks if the token address is set
  /// @dev functions implementing this modifier can only run if token address is set
  modifier isTokenSet() {
        require(stakingToken != IERC20(address(0)), "No token address set");
        _;
  }

  //check if withdraw function is withdrawable
  /**modifier isLocked () {

  }*/
  
  /// @notice sets token address
  /// @dev sets ERC20 token address
  /// @param _tokenAddress ERC20 token address
  function setStakingToken(address _tokenAddress) public onlyOwner() {
    stakingToken = IERC20(_tokenAddress);
    emit TokenAddressSet(msg.sender, _tokenAddress);
  }

  /// @notice user stakes amount of tokens
  /// @dev check that user approved token amount
  /// @param _amount to stake
  function stake(uint256 _amount) public isTokenSet() nonReentrant payable {
    require(stakingToken.balanceOf(msg.sender) >= _amount, "Not enough funds");
    require(stakingToken.allowance(msg.sender, address(this)) >= _amount, "Not approved");
    require(stakingToken.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");
    stakes[msg.sender] = stakes[msg.sender].add(_amount);
    // todo stakeholderCount++;
    emit Staked(msg.sender, _amount);
  }

  /// @notice unstakes token amount
  /// @dev check that amount is valid
  /// @param _amount to unstake
  function unstake(uint256 _amount) public isTokenSet() nonReentrant {
    require(stakes[msg.sender] >= _amount && stakes[msg.sender] > 0);
    stakes[msg.sender] = stakes[msg.sender].sub(_amount);
    stakingToken.transfer(msg.sender, _amount);
    emit Unstaked(msg.sender, _amount);
  }

  /// @notice return the token address
  /// @dev get the ERC20 address to interact with the specific token
  /// @return return ERC20 address
  function getStakingToken () public view returns (IERC20) {
    return stakingToken;
  }

  /// @notice get the staked amount for a specific address
  /// @dev call the mapping stake to get amount of tokens staked by specific address
  /// @param _address address that staked
  /// @return uint amount of tokens staked
  function getStakeOf(address _address) public view returns (uint256) {
    return stakes[_address];
  }

  /// @notice return the staked amount of the caller
  /// @dev return the staked amount of msg.sender
  /// @return uint256 amount of tokens staked
  function getStake () public view returns (uint256) {
    return stakes[msg.sender];
  }

  /// todo implement reward functionality
  function claimReward() public {
    //
  }

}