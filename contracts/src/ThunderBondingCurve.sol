// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ThunderBondingCurve is ERC20 {
    IERC20 public immutable usdc;
    
    uint256 public constant BASE_PRICE = 1e15;
    uint256 public constant PRICE_INCREMENT = 1e12;
    
    event Purchased(address indexed buyer, uint256 thunderAmount, uint256 usdcCost);
    event Sold(address indexed seller, uint256 thunderAmount, uint256 usdcReturn);
    
    constructor(address _usdc) ERC20("Thunder Coin", "THUNDER") {
        usdc = IERC20(_usdc);
    }
    
    function getBuyPrice(uint256 thunderAmount) public view returns (uint256) {
        uint256 currentSupply = totalSupply();
        uint256 integratedPrice = (BASE_PRICE * thunderAmount) + 
                                  (PRICE_INCREMENT * (currentSupply * thunderAmount + thunderAmount * thunderAmount / 2)) / 1e18;
        return integratedPrice;
    }
    
    function getSellPrice(uint256 thunderAmount) public view returns (uint256) {
        uint256 currentSupply = totalSupply();
        require(currentSupply >= thunderAmount, "Not enough supply");
        uint256 newSupply = currentSupply - thunderAmount;
        uint256 integratedPrice = (BASE_PRICE * thunderAmount) + 
                                  (PRICE_INCREMENT * (newSupply * thunderAmount + thunderAmount * thunderAmount / 2)) / 1e18;
        return integratedPrice;
    }
    
    function buy(uint256 thunderAmount) external {
        require(thunderAmount > 0, "Amount must be greater than 0");
        uint256 usdcCost = getBuyPrice(thunderAmount);
        require(usdc.transferFrom(msg.sender, address(this), usdcCost), "USDC transfer failed");
        _mint(msg.sender, thunderAmount);
        emit Purchased(msg.sender, thunderAmount, usdcCost);
    }
    
    function sell(uint256 thunderAmount) external {
        require(thunderAmount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= thunderAmount, "Insufficient balance");
        uint256 usdcReturn = getSellPrice(thunderAmount);
        require(usdc.balanceOf(address(this)) >= usdcReturn, "Insufficient USDC in contract");
        _burn(msg.sender, thunderAmount);
        require(usdc.transfer(msg.sender, usdcReturn), "USDC transfer failed");
        emit Sold(msg.sender, thunderAmount, usdcReturn);
    }
}
