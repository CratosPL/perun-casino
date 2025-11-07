// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ThunderBondingCurve
 * @notice Simple Linear Bonding Curve for Thunder Token
 * @dev Buy/Sell Thunder with USDC - Price increases/decreases with supply
 */
contract ThunderBondingCurve is ERC20, Ownable, ReentrancyGuard {
    IERC20 public immutable usdc;
    
    // ============ BONDING CURVE PARAMETERS ============
    uint256 public constant INITIAL_PRICE = 1e3; // 0.001 USDC per Thunder (1 USDC = 1000 Thunder)
    uint256 public constant SLOPE = 1e15; // Price increases by 0.001 USDC per 1M Thunder supply
    uint256 public constant PRICE_DIVISOR = 1e18;
    
    // ============ FEES ============
    uint256 public constant BUY_FEE_PERCENT = 100; // 1%
    uint256 public constant SELL_FEE_PERCENT = 200; // 2%
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // ============ STORAGE ============
    uint256 public reserveBalance; // USDC held in contract
    uint256 public collectedFees; // Fees for owner
    
    // ============ EVENTS ============
    event ThunderBought(
        address indexed buyer, 
        uint256 usdcSpent, 
        uint256 thunderReceived,
        uint256 fee
    );
    
    event ThunderSold(
        address indexed seller, 
        uint256 thunderSold, 
        uint256 usdcReceived,
        uint256 fee
    );
    
    event FeesWithdrawn(address indexed owner, uint256 amount);
    
    // ============ CONSTRUCTOR ============
    constructor(address _usdc) ERC20("Thunder Token", "THUNDER") Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        usdc = IERC20(_usdc);
    }
    
    // ============ BONDING CURVE MATH ============
    
    /**
     * @notice Calculate price for buying Thunder tokens
     * @param thunderAmount Amount of Thunder to buy (18 decimals)
     * @return usdcCost Total USDC cost including fees (6 decimals)
     */
    function getBuyPrice(uint256 thunderAmount) public view returns (uint256 usdcCost) {
        if (thunderAmount == 0) return 0;
        
        uint256 currentSupply = totalSupply();
        uint256 newSupply = currentSupply + thunderAmount;
        
        // Calculate area under linear curve: Cost = ∫(INITIAL_PRICE + SLOPE * s) ds
        // Integration: (INITIAL_PRICE * amount) + (SLOPE * (s1² - s0²) / 2)
        uint256 avgPrice = INITIAL_PRICE + (SLOPE * (currentSupply + newSupply)) / (2 * PRICE_DIVISOR);
        uint256 baseCost = (avgPrice * thunderAmount) / 1e18; // Convert to USDC (6 decimals)
        
        // Add 1% buy fee
        uint256 fee = (baseCost * BUY_FEE_PERCENT) / FEE_DENOMINATOR;
        usdcCost = baseCost + fee;
        
        return usdcCost;
    }
    
    /**
     * @notice Calculate USDC received for selling Thunder tokens
     * @param thunderAmount Amount of Thunder to sell (18 decimals)
     * @return usdcReceived USDC received after fees (6 decimals)
     */
    function getSellPrice(uint256 thunderAmount) public view returns (uint256 usdcReceived) {
        if (thunderAmount == 0) return 0;
        
        uint256 currentSupply = totalSupply();
        require(thunderAmount <= currentSupply, "Exceeds total supply");
        
        uint256 newSupply = currentSupply - thunderAmount;
        
        // Calculate area under curve (same formula as buy)
        uint256 avgPrice = INITIAL_PRICE + (SLOPE * (currentSupply + newSupply)) / (2 * PRICE_DIVISOR);
        uint256 baseReturn = (avgPrice * thunderAmount) / 1e18;
        
        // Deduct 2% sell fee
        uint256 fee = (baseReturn * SELL_FEE_PERCENT) / FEE_DENOMINATOR;
        usdcReceived = baseReturn - fee;
        
        require(usdcReceived <= reserveBalance, "Insufficient reserve");
        return usdcReceived;
    }
    
    // ============ BUY FUNCTION ============
    
    /**
     * @notice Buy Thunder tokens with USDC
     * @param thunderAmount Amount of Thunder tokens to buy (18 decimals)
     */
    function buy(uint256 thunderAmount) external nonReentrant {
        require(thunderAmount > 0, "Amount must be > 0");
        require(thunderAmount >= 1e18, "Minimum 1 Thunder"); // Min 1 token
        
        uint256 usdcCost = getBuyPrice(thunderAmount);
        require(usdcCost > 0, "Invalid price");
        
        // Transfer USDC from buyer
        require(
            usdc.transferFrom(msg.sender, address(this), usdcCost),
            "USDC transfer failed"
        );
        
        // Calculate fee
        uint256 baseCost = (usdcCost * FEE_DENOMINATOR) / (FEE_DENOMINATOR + BUY_FEE_PERCENT);
        uint256 fee = usdcCost - baseCost;
        
        // Update state
        reserveBalance += baseCost;
        collectedFees += fee;
        
        // Mint Thunder tokens
        _mint(msg.sender, thunderAmount);
        
        emit ThunderBought(msg.sender, usdcCost, thunderAmount, fee);
    }
    
    // ============ SELL FUNCTION ============
    
    /**
     * @notice Sell Thunder tokens for USDC
     * @param thunderAmount Amount of Thunder tokens to sell (18 decimals)
     */
    function sell(uint256 thunderAmount) external nonReentrant {
        require(thunderAmount > 0, "Amount must be > 0");
        require(balanceOf(msg.sender) >= thunderAmount, "Insufficient balance");
        
        uint256 usdcReturn = getSellPrice(thunderAmount);
        require(usdcReturn > 0, "Invalid return amount");
        require(usdcReturn <= reserveBalance, "Insufficient reserve");
        
        // Calculate fee
        uint256 baseReturn = (usdcReturn * FEE_DENOMINATOR) / (FEE_DENOMINATOR - SELL_FEE_PERCENT);
        uint256 fee = baseReturn - usdcReturn;
        
        // Burn Thunder tokens
        _burn(msg.sender, thunderAmount);
        
        // Update state
        reserveBalance -= baseReturn;
        collectedFees += fee;
        
        // Transfer USDC to seller
        require(
            usdc.transfer(msg.sender, usdcReturn),
            "USDC transfer failed"
        );
        
        emit ThunderSold(msg.sender, thunderAmount, usdcReturn, fee);
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @notice Withdraw collected fees (owner only)
     */
    function withdrawFees() external onlyOwner nonReentrant {
        uint256 amount = collectedFees;
        require(amount > 0, "No fees to withdraw");
        
        collectedFees = 0;
        
        require(
            usdc.transfer(owner(), amount),
            "Fee withdrawal failed"
        );
        
        emit FeesWithdrawn(owner(), amount);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @notice Get current spot price (price for next single token)
     */
    function getCurrentPrice() external view returns (uint256) {
        return getBuyPrice(1e18); // Price for 1 Thunder
    }
    
    /**
     * @notice Get contract stats
     */
    function getStats() external view returns (
        uint256 totalSupply_,
        uint256 reserveBalance_,
        uint256 collectedFees_,
        uint256 currentPrice_
    ) {
        return (
            totalSupply(),
            reserveBalance,
            collectedFees,
            getBuyPrice(1e18)
        );
    }
}
