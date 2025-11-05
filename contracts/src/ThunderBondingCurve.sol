// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ThunderBondingCurve is ERC20 {
    IERC20 public immutable usdc;
    
    // USDC ma 6 decimals! Thunder ma 18 decimals!
    uint256 public constant BASE_PRICE = 1e3;           // 0.001 USDC per 1 Thunder token (1000 Thunder = $1)
    uint256 public constant PRICE_INCREMENT = 1e0;      // +0.000001 USDC per token in supply
    uint256 public constant USDC_DECIMALS = 6;
    uint256 public constant THUNDER_DECIMALS = 18;
    
    event Purchased(address indexed buyer, uint256 thunderAmount, uint256 usdcCost);
    event Sold(address indexed seller, uint256 thunderAmount, uint256 usdcReturn);
    
    constructor(address _usdc) ERC20("Thunder Coin", "THUNDER") {
        usdc = IERC20(_usdc);
    }
    
    function getBuyPrice(uint256 thunderAmount) public view returns (uint256) {
        uint256 currentSupply = totalSupply();
        
        // Convert Thunder (18 decimals) to whole tokens
        uint256 thunderTokens = thunderAmount / 1e18;
        uint256 currentTokens = currentSupply / 1e18;
        
        // Linear bonding curve: price = BASE_PRICE + (supply * PRICE_INCREMENT)
        // Integrated: cost = BASE_PRICE * amount + PRICE_INCREMENT * (currentSupply * amount + amount^2 / 2)
        uint256 baseCost = BASE_PRICE * thunderTokens;
        uint256 incrementCost = PRICE_INCREMENT * (currentTokens * thunderTokens + (thunderTokens * thunderTokens) / 2);
        
        return baseCost + incrementCost;
    }
    
    function getSellPrice(uint256 thunderAmount) public view returns (uint256) {
        uint256 currentSupply = totalSupply();
        require(currentSupply >= thunderAmount, "Not enough supply");
        
        uint256 thunderTokens = thunderAmount / 1e18;
        uint256 newTokens = (currentSupply - thunderAmount) / 1e18;
        
        uint256 baseCost = BASE_PRICE * thunderTokens;
        uint256 incrementCost = PRICE_INCREMENT * (newTokens * thunderTokens + (thunderTokens * thunderTokens) / 2);
        
        return baseCost + incrementCost;
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
