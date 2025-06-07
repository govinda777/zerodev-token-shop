// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract TokenFaucet is Ownable, ReentrancyGuard, Pausable {
    IERC20 public immutable token;
    uint256 public faucetAmount = 25 * 10**18; // 25 tokens
    uint256 public cooldownTime = 24 hours;
    uint256 public totalClaimed;
    uint256 public totalUsers;
    
    mapping(address => uint256) public lastClaim;
    mapping(address => uint256) public totalClaimedByUser;
    mapping(address => bool) public hasClaimedBefore;
    
    event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event FaucetAmountUpdated(uint256 oldAmount, uint256 newAmount);
    event CooldownUpdated(uint256 oldCooldown, uint256 newCooldown);
    event FaucetRefilled(uint256 amount);
    event EmergencyWithdrawal(uint256 amount);
    
    error InsufficientFaucetBalance();
    error CooldownNotPassed();
    error ZeroAddress();
    error InvalidAmount();
    
    constructor(address _token) Ownable(msg.sender) {
        if (_token == address(0)) revert ZeroAddress();
        token = IERC20(_token);
    }
    
    /**
     * @dev Check if a user can claim tokens
     * @param user Address to check
     * @return bool True if user can claim
     */
    function canClaim(address user) public view returns (bool) {
        return block.timestamp >= lastClaim[user] + cooldownTime;
    }
    
    /**
     * @dev Get time remaining until next claim
     * @param user Address to check
     * @return uint256 Seconds remaining, 0 if can claim now
     */
    function timeUntilNextClaim(address user) public view returns (uint256) {
        uint256 nextClaimTime = lastClaim[user] + cooldownTime;
        if (block.timestamp >= nextClaimTime) {
            return 0;
        }
        return nextClaimTime - block.timestamp;
    }
    
    /**
     * @dev Request tokens from faucet
     */
    function requestTokens() external nonReentrant whenNotPaused {
        if (!canClaim(msg.sender)) revert CooldownNotPassed();
        if (token.balanceOf(address(this)) < faucetAmount) revert InsufficientFaucetBalance();
        
        // Update user stats
        if (!hasClaimedBefore[msg.sender]) {
            hasClaimedBefore[msg.sender] = true;
            totalUsers++;
        }
        
        lastClaim[msg.sender] = block.timestamp;
        totalClaimedByUser[msg.sender] += faucetAmount;
        totalClaimed += faucetAmount;
        
        // Transfer tokens
        bool success = token.transfer(msg.sender, faucetAmount);
        require(success, "Token transfer failed");
        
        emit TokensClaimed(msg.sender, faucetAmount, block.timestamp);
    }
    
    /**
     * @dev Set the amount of tokens given per claim
     * @param _amount New amount in wei
     */
    function setFaucetAmount(uint256 _amount) external onlyOwner {
        if (_amount == 0) revert InvalidAmount();
        uint256 oldAmount = faucetAmount;
        faucetAmount = _amount;
        emit FaucetAmountUpdated(oldAmount, _amount);
    }
    
    /**
     * @dev Set the cooldown time between claims
     * @param _cooldown New cooldown time in seconds
     */
    function setCooldownTime(uint256 _cooldown) external onlyOwner {
        if (_cooldown == 0) revert InvalidAmount();
        uint256 oldCooldown = cooldownTime;
        cooldownTime = _cooldown;
        emit CooldownUpdated(oldCooldown, _cooldown);
    }
    
    /**
     * @dev Refill faucet with tokens
     * @param amount Amount of tokens to add
     */
    function refillFaucet(uint256 amount) external onlyOwner {
        if (amount == 0) revert InvalidAmount();
        bool success = token.transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");
        emit FaucetRefilled(amount);
    }
    
    /**
     * @dev Withdraw tokens from faucet
     * @param amount Amount to withdraw
     */
    function withdrawTokens(uint256 amount) external onlyOwner {
        if (amount == 0) revert InvalidAmount();
        if (token.balanceOf(address(this)) < amount) revert InsufficientFaucetBalance();
        
        bool success = token.transfer(owner(), amount);
        require(success, "Token transfer failed");
    }
    
    /**
     * @dev Emergency withdrawal of all tokens
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        if (balance > 0) {
            bool success = token.transfer(owner(), balance);
            require(success, "Token transfer failed");
            emit EmergencyWithdrawal(balance);
        }
    }
    
    /**
     * @dev Pause the faucet
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the faucet
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get faucet statistics
     * @return faucetBalance Current token balance of faucet
     * @return _totalClaimed Total tokens claimed from faucet
     * @return _totalUsers Total unique users who have claimed
     * @return _faucetAmount Current amount per claim
     * @return _cooldownTime Current cooldown time
     */
    function getFaucetStats() external view returns (
        uint256 faucetBalance,
        uint256 _totalClaimed,
        uint256 _totalUsers,
        uint256 _faucetAmount,
        uint256 _cooldownTime
    ) {
        return (
            token.balanceOf(address(this)),
            totalClaimed,
            totalUsers,
            faucetAmount,
            cooldownTime
        );
    }
    
    /**
     * @dev Get user claim statistics
     * @param user Address to check
     * @return _lastClaim Timestamp of last claim
     * @return _totalClaimed Total tokens claimed by user
     * @return _canClaim Whether user can claim now
     * @return _timeUntilNext Seconds until next claim (0 if can claim now)
     */
    function getUserStats(address user) external view returns (
        uint256 _lastClaim,
        uint256 _totalClaimed,
        bool _canClaim,
        uint256 _timeUntilNext
    ) {
        return (
            lastClaim[user],
            totalClaimedByUser[user],
            canClaim(user),
            timeUntilNextClaim(user)
        );
    }
} 