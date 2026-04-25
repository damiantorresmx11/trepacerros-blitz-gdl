// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PrimaToken
 * @notice Token de recompensa canjeable en comercios aliados.
 * @dev NO es una criptomoneda — es un cupón digital.
 *      Solo el contrato RastroNFT puede mintear (via setMinter).
 *      El RewardRegistry puede quemar al canjear.
 */
contract PrimaToken is ERC20, Ownable {
    address public minter;
    address public burner;

    modifier onlyMinter() {
        require(msg.sender == minter, "Not authorized to mint");
        _;
    }

    modifier onlyBurner() {
        require(msg.sender == burner, "Not authorized to burn");
        _;
    }

    constructor() ERC20("Prima Token", "PRIMA") Ownable(msg.sender) {}

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    function setBurner(address _burner) external onlyOwner {
        burner = _burner;
    }

    function mint(address to, uint256 amount) external onlyMinter {
        _mint(to, amount);
    }

    function burnFrom(address from, uint256 amount) external onlyBurner {
        _burn(from, amount);
    }
}
