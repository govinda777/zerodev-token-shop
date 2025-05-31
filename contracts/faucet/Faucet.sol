pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Faucet is Ownable {
    IERC20 public token;
    mapping(address => uint256) public lastClaim;
    uint256 public constant CLAIM_INTERVAL = 24 hours;
    uint256 public constant CLAIM_AMOUNT = 100 * 10**18; // 100 tokens

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    function claimTokens() external {
        require(canClaim(msg.sender), "Cannot claim yet");
        require(token.balanceOf(address(this)) >= CLAIM_AMOUNT, "Insufficient funds in faucet");

        lastClaim[msg.sender] = block.timestamp;
        token.transfer(msg.sender, CLAIM_AMOUNT);
    }

    function canClaim(address user) public view returns (bool) {
        return block.timestamp >= lastClaim[user] + CLAIM_INTERVAL;
    }

    function addTokens(uint256 amount) external onlyOwner {
        token.transferFrom(msg.sender, address(this), amount);
    }

    function withdrawTokens(uint256 amount) external onlyOwner {
        token.transfer(msg.sender, amount);
    }

    function verifyX(address user) external view returns (bool) {
        // TODO: Implement X verification logic
        return true; // Placeholder
    }
}
