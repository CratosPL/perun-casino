// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ThunderBondingCurve
 * @notice Simple Linear Bonding Curve for Thunder Token
 */
contract ThunderBondingCurve is ERC20, Ownable, ReentrancyGuard {
    IERC20 public immutable usdc;
    
    uint256 public constant INITIAL_PRICE = 1e6; // 0.001 USDC per Thunder (1 USDC = 1000 Thunder) - in wei
    uint256 public constant SLOPE = 1e3; // ✅ FIX: Small slope for price increase
    uint256 public constant BUY_FEE_PERCENT = 100; // 1%
    uint256 public constant SELL_FEE_PERCENT = 200; // 2%
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    uint256 public reserveBalance;
    uint256 public collectedFees;
    
    event ThunderBought(address indexed buyer, uint256 usdcSpent, uint256 thunderReceived, uint256 fee);
    event ThunderSold(address indexed seller, uint256 thunderSold, uint256 usdcReceived, uint256 fee);
    event FeesWithdrawn(address indexed owner, uint256 amount);
    
    constructor(address _usdc) ERC20("Thunder Token", "THUNDER") Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        usdc = IERC20(_usdc);
    }
    
    /**
     * @notice Calculate price for buying Thunder tokens
     */
    function getBuyPrice(uint256 thunderAmount) public view returns (uint256 usdcCost) {
        if (thunderAmount == 0) return 0;
        
        uint256 currentSupply = totalSupply() / 1e18; // Convert to thousands for calculation
        uint256 newSupply = currentSupply + (thunderAmount / 1e18);
        
        // avgPrice = INITIAL_PRICE + SLOPE * (currentSupply + newSupply) / 2
        uint256 avgPrice = INITIAL_PRICE + (SLOPE * (currentSupply + newSupply)) / 2;
        
        // baseCost in wei (6 decimals = USDC)
        uint256 baseCost = (avgPrice * thunderAmount) / 1e18;
        
        // Add 1% buy fee
        uint256 fee = (baseCost * BUY_FEE_PERCENT) / FEE_DENOMINATOR;
        usdcCost = baseCost + fee;
        
        return usdcCost;
    }
    
    /**
     * @notice Calculate USDC received for selling Thunder tokens
     */
    function getSellPrice(uint256 thunderAmount) public view returns (uint256 usdcReceived) {
        if (thunderAmount == 0) return 0;
        
        uint256 currentSupply = totalSupply() / 1e18;
        require(thunderAmount / 1e18 <= currentSupply, "Exceeds total supply");
        
        uint256 newSupply = currentSupply - (thunderAmount / 1e18);
        
        uint256 avgPrice = INITIAL_PRICE + (SLOPE * (currentSupply + newSupply)) / 2;
        uint256 baseReturn = (avgPrice * thunderAmount) / 1e18;
        
        // Deduct 2% sell fee
        uint256 fee = (baseReturn * SELL_FEE_PERCENT) / FEE_DENOMINATOR;
        usdcReceived = baseReturn - fee;
        
        require(usdcReceived <= reserveBalance, "Insufficient reserve");
        return usdcReceived;
    }
    
    /**
     * @notice Buy Thunder tokens with USDC
     */
    function buy(uint256 thunderAmount) external nonReentrant {
        require(thunderAmount > 0, "Amount must be > 0");
        require(thunderAmount >= 1e18, "Minimum 1 Thunder");
        
        uint256 usdcCost = getBuyPrice(thunderAmount);
        require(usdcCost > 0, "Invalid price");
        
        require(usdc.transferFrom(msg.sender, address(this), usdcCost), "USDC transfer failed");
        
        uint256 baseCost = (usdcCost * FEE_DENOMINATOR) / (FEE_DENOMINATOR + BUY_FEE_PERCENT);
        uint256 fee = usdcCost - baseCost;
        
        reserveBalance += baseCost;
        collectedFees += fee;
        
        _mint(msg.sender, thunderAmount);
        
        emit ThunderBought(msg.sender, usdcCost, thunderAmount, fee);
    }
    
    /**
     * @notice Sell Thunder tokens for USDC
     */
    function sell(uint256 thunderAmount) external nonReentrant {
        require(thunderAmount > 0, "Amount must be > 0");
        require(balanceOf(msg.sender) >= thunderAmount, "Insufficient balance");
        
        uint256 usdcReturn = getSellPrice(thunderAmount);
        require(usdcReturn > 0, "Invalid return amount");
        require(usdcReturn <= reserveBalance, "Insufficient reserve");
        
        uint256 baseReturn = (usdcReturn * FEE_DENOMINATOR) / (FEE_DENOMINATOR - SELL_FEE_PERCENT);
        uint256 fee = baseReturn - usdcReturn;
        
        _burn(msg.sender, thunderAmount);
        
        reserveBalance -= baseReturn;
        collectedFees += fee;
        
        require(usdc.transfer(msg.sender, usdcReturn), "USDC transfer failed");
        
        emit ThunderSold(msg.sender, thunderAmount, usdcReturn, fee);
    }
    
    function withdrawFees() external onlyOwner nonReentrant {
        uint256 amount = collectedFees;
        require(amount > 0, "No fees to withdraw");
        
        collectedFees = 0;
        require(usdc.transfer(owner(), amount), "Fee withdrawal failed");
        
        emit FeesWithdrawn(owner(), amount);
    }
    
    function getCurrentPrice() external view returns (uint256) {
        return getBuyPrice(1e18);
    }
    
    function getStats() external view returns (uint256, uint256, uint256, uint256) {
        return (totalSupply(), reserveBalance, collectedFees, getBuyPrice(1e18));
    }
}
