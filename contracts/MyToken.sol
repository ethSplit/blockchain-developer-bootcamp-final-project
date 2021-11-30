// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MyToken is ERC20, Ownable {

    using SafeMath for uint;

    event TokenMinted(address to, uint amount);

    constructor(uint _amount) ERC20("MyToken", "MTK") {
        _mint(msg.sender, _amount * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner() {
        _mint(to, amount);
        emit TokenMinted(to, amount);
    }
}
