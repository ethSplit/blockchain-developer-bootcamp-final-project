// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/// @title MyToken
/// @notice Deploy an ERC20 Token
/// @dev the contract creator gets inital Tokens minted
contract MyToken is ERC20, Ownable {
    
    /// @notice Using Safemath to avoid over- / underflows
    /// @dev importing SafeMath from openzeppelin
    using SafeMath for uint;

    /// @notice Event occurs when Tokens get minted
    /// @param amount uint
    event TokenMinted(address to, uint amount);

    /// @notice Constructor function
    /// @dev calls mint function
    /// @param _amount an uint parameter
    constructor(uint _amount) ERC20("MyToken", "MTK") {
        _mint(msg.sender, _amount * 10 ** decimals());
    }

    /// @notice Mints new Tokens
    /// @dev can only be called by owner
    /// @param to beneficiary address
    /// @param amount token amount uint
    function mint(address to, uint256 amount) public onlyOwner() {
        _mint(to, amount);
        emit TokenMinted(to, amount);
    }
}
