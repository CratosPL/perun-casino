// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract GameRewards is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;
    
    IERC20 public thunder;
    
    mapping(address => uint256) public gameBalance;
    mapping(address => uint256) public totalThunderWon;
    mapping(address => uint256) public gamesPlayed;
    mapping(address => uint256) public monthlyWinnings;
    
    address[] public leaderboardAddresses;
    address public backendSigner;
    
    uint256 public currentMonth;
    uint256 public lastRewardDistribution;
    
    event GameDeposit(address indexed player, uint256 amount);
    event GameWithdraw(address indexed player, uint256 deposited, uint256 winnings);
    event WinningsRecorded(address indexed player, uint256 winnings);
    event LeaderboardReset(uint256 newMonth);
    event RewardsDistributed(address indexed player, uint256 usdcReward);
    
    constructor(address _thunder, address _backendSigner) Ownable(msg.sender) {
        thunder = IERC20(_thunder);
        backendSigner = _backendSigner;
        currentMonth = block.timestamp / 30 days;
    }
    
    function depositThunderForGaming(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(thunder.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        gameBalance[msg.sender] += amount;
        emit GameDeposit(msg.sender, amount);
    }
    
    function withdrawFromGame(uint256 finalBalance, bytes calldata signature) external nonReentrant {
        address player = msg.sender;
        uint256 deposited = gameBalance[player];
        
        require(deposited > 0, "No active game");
        require(finalBalance <= deposited * 10, "Balance too high");
        
        bytes32 messageHash = keccak256(abi.encodePacked(player, finalBalance, block.chainid));
        bytes32 signedHash = messageHash.toEthSignedMessageHash();
        address recoveredSigner = signedHash.recover(signature);
        require(recoveredSigner == backendSigner, "Invalid signature");
        
        uint256 winnings = finalBalance > deposited ? finalBalance - deposited : 0;
        gameBalance[player] = 0;
        gamesPlayed[player]++;
        
        if (winnings > 0) {
            recordWinnings(player, winnings);
        }
        
        emit GameWithdraw(player, deposited, winnings);
    }
    
    function recordWinnings(address player, uint256 winnings) internal {
        checkAndResetMonthlyLeaderboard();
        monthlyWinnings[player] += winnings;
        totalThunderWon[player] += winnings;
        
        bool found = false;
        for (uint i = 0; i < leaderboardAddresses.length; i++) {
            if (leaderboardAddresses[i] == player) {
                found = true;
                break;
            }
        }
        if (!found && leaderboardAddresses.length < 1000) {
            leaderboardAddresses.push(player);
        }
        emit WinningsRecorded(player, winnings);
    }
    
    function checkAndResetMonthlyLeaderboard() internal {
        uint256 newMonth = block.timestamp / 30 days;
        if (newMonth > currentMonth) {
            currentMonth = newMonth;
            leaderboardAddresses = new address[](0);
            emit LeaderboardReset(newMonth);
        }
    }
    
    function getLeaderboard() external view returns (address[] memory, uint256[] memory) {
        uint256 len = leaderboardAddresses.length;
        address[] memory sorted = new address[](len);
        uint256[] memory amounts = new uint256[](len);
        
        for (uint i = 0; i < len; i++) {
            sorted[i] = leaderboardAddresses[i];
            amounts[i] = monthlyWinnings[leaderboardAddresses[i]];
        }
        
        for (uint i = 0; i < len; i++) {
            for (uint j = i + 1; j < len; j++) {
                if (amounts[j] > amounts[i]) {
                    (sorted[i], sorted[j]) = (sorted[j], sorted[i]);
                    (amounts[i], amounts[j]) = (amounts[j], amounts[i]);
                }
            }
        }
        
        uint256 limit = len < 100 ? len : 100;
        address[] memory top = new address[](limit);
        uint256[] memory topWinnings = new uint256[](limit);
        for (uint i = 0; i < limit; i++) {
            top[i] = sorted[i];
            topWinnings[i] = amounts[i];
        }
        return (top, topWinnings);
    }
    
    function getPlayerStats(address player) external view returns (uint256, uint256, uint256) {
        return (gamesPlayed[player], totalThunderWon[player], monthlyWinnings[player]);
    }
    
    function distributeMonthlyRewards(address[] calldata players, uint256[] calldata rewards, address usdc) external onlyOwner nonReentrant {
        require(players.length == rewards.length, "Length mismatch");
        require(players.length <= 100, "Max 100 players");
        IERC20 usdcToken = IERC20(usdc);
        for (uint i = 0; i < players.length; i++) {
            require(usdcToken.transfer(players[i], rewards[i]), "Transfer failed");
            emit RewardsDistributed(players[i], rewards[i]);
        }
        lastRewardDistribution = block.timestamp;
    }
    
    function setBackendSigner(address newSigner) external onlyOwner {
        require(newSigner != address(0), "Invalid address");
        backendSigner = newSigner;
    }
    
    function withdrawToken(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(owner(), amount), "Transfer failed");
    }
    
    function burnThunderForNFT(uint256 amount) external {
        require(false, "Coming soon - v2");
    }
}
