//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockMaticToken is ERC20 {
    constructor() ERC20("MockMATICToken", "MATIC") {
        _mint(msg.sender, 100000000 * 10**decimals());
    }
}
