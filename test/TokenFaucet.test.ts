import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { ZeroDevToken, TokenFaucet } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("TokenFaucet", function () {
  let token: ZeroDevToken;
  let faucet: TokenFaucet;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  const FAUCET_AMOUNT = ethers.parseEther("25");
  const COOLDOWN_TIME = 24 * 60 * 60; // 24 hours

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy Token
    const TokenFactory = await ethers.getContractFactory("ZeroDevToken");
    token = await TokenFactory.deploy();
    await token.waitForDeployment();

    // Deploy Faucet
    const FaucetFactory = await ethers.getContractFactory("TokenFaucet");
    faucet = await FaucetFactory.deploy(await token.getAddress());
    await faucet.waitForDeployment();

    // Transfer tokens to faucet
    const faucetSupply = ethers.parseEther("10000");
    await token.transfer(await faucet.getAddress(), faucetSupply);
  });

  describe("Deployment", function () {
    it("Should set the correct token address", async function () {
      expect(await faucet.token()).to.equal(await token.getAddress());
    });

    it("Should set the correct initial faucet amount", async function () {
      expect(await faucet.faucetAmount()).to.equal(FAUCET_AMOUNT);
    });

    it("Should set the correct initial cooldown time", async function () {
      expect(await faucet.cooldownTime()).to.equal(COOLDOWN_TIME);
    });

    it("Should set the correct owner", async function () {
      expect(await faucet.owner()).to.equal(owner.address);
    });

    it("Should revert with zero address", async function () {
      const FaucetFactory = await ethers.getContractFactory("TokenFaucet");
      await expect(
        FaucetFactory.deploy(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(faucet, "ZeroAddress");
    });
  });

  describe("Claiming", function () {
    it("Should allow user to claim tokens", async function () {
      const initialBalance = await token.balanceOf(user1.address);
      
      await faucet.connect(user1).requestTokens();
      
      const finalBalance = await token.balanceOf(user1.address);
      expect(finalBalance - initialBalance).to.equal(FAUCET_AMOUNT);
    });

    it("Should update user statistics after claim", async function () {
      await faucet.connect(user1).requestTokens();
      
      const [lastClaim, totalClaimed, canClaim, timeUntilNext] = await faucet.getUserStats(user1.address);
      
      expect(totalClaimed).to.equal(FAUCET_AMOUNT);
      expect(canClaim).to.be.false;
      expect(timeUntilNext).to.be.greaterThan(0);
    });

    it("Should increment total users and total claimed", async function () {
      const [, initialTotalClaimed, initialTotalUsers] = await faucet.getFaucetStats();
      
      await faucet.connect(user1).requestTokens();
      
      const [, finalTotalClaimed, finalTotalUsers] = await faucet.getFaucetStats();
      
      expect(finalTotalClaimed - initialTotalClaimed).to.equal(FAUCET_AMOUNT);
      expect(finalTotalUsers - initialTotalUsers).to.equal(1);
    });

    it("Should emit TokensClaimed event", async function () {
      await expect(faucet.connect(user1).requestTokens())
        .to.emit(faucet, "TokensClaimed");
    });

    it("Should not allow claim during cooldown period", async function () {
      await faucet.connect(user1).requestTokens();
      
      await expect(
        faucet.connect(user1).requestTokens()
      ).to.be.revertedWithCustomError(faucet, "CooldownNotPassed");
    });

    it("Should allow claim after cooldown period", async function () {
      await faucet.connect(user1).requestTokens();
      
      // Advance time by cooldown period
      await time.increase(COOLDOWN_TIME);
      
      const initialBalance = await token.balanceOf(user1.address);
      await faucet.connect(user1).requestTokens();
      const finalBalance = await token.balanceOf(user1.address);
      
      expect(finalBalance - initialBalance).to.equal(FAUCET_AMOUNT);
    });

    it("Should not allow claim if faucet has insufficient balance", async function () {
      // Drain faucet
      await faucet.emergencyWithdraw();
      
      await expect(
        faucet.connect(user1).requestTokens()
      ).to.be.revertedWithCustomError(faucet, "InsufficientFaucetBalance");
    });

    it("Should allow multiple users to claim", async function () {
      await faucet.connect(user1).requestTokens();
      await faucet.connect(user2).requestTokens();
      
      expect(await token.balanceOf(user1.address)).to.equal(FAUCET_AMOUNT);
      expect(await token.balanceOf(user2.address)).to.equal(FAUCET_AMOUNT);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to set faucet amount", async function () {
      const newAmount = ethers.parseEther("50");
      
      await expect(faucet.setFaucetAmount(newAmount))
        .to.emit(faucet, "FaucetAmountUpdated")
        .withArgs(FAUCET_AMOUNT, newAmount);
      
      expect(await faucet.faucetAmount()).to.equal(newAmount);
    });

    it("Should not allow non-owner to set faucet amount", async function () {
      const newAmount = ethers.parseEther("50");
      
      await expect(
        faucet.connect(user1).setFaucetAmount(newAmount)
      ).to.be.revertedWithCustomError(faucet, "OwnableUnauthorizedAccount");
    });

    it("Should not allow setting zero faucet amount", async function () {
      await expect(
        faucet.setFaucetAmount(0)
      ).to.be.revertedWithCustomError(faucet, "InvalidAmount");
    });

    it("Should allow owner to set cooldown time", async function () {
      const newCooldown = 12 * 60 * 60; // 12 hours
      
      await expect(faucet.setCooldownTime(newCooldown))
        .to.emit(faucet, "CooldownUpdated")
        .withArgs(COOLDOWN_TIME, newCooldown);
      
      expect(await faucet.cooldownTime()).to.equal(newCooldown);
    });

    it("Should not allow non-owner to set cooldown time", async function () {
      const newCooldown = 12 * 60 * 60;
      
      await expect(
        faucet.connect(user1).setCooldownTime(newCooldown)
      ).to.be.revertedWithCustomError(faucet, "OwnableUnauthorizedAccount");
    });

    it("Should allow owner to refill faucet", async function () {
      const refillAmount = ethers.parseEther("1000");
      
      // First approve the faucet to spend tokens
      await token.approve(await faucet.getAddress(), refillAmount);
      
      await expect(faucet.refillFaucet(refillAmount))
        .to.emit(faucet, "FaucetRefilled")
        .withArgs(refillAmount);
    });

    it("Should allow owner to withdraw tokens", async function () {
      const withdrawAmount = ethers.parseEther("1000");
      const initialOwnerBalance = await token.balanceOf(owner.address);
      
      await faucet.withdrawTokens(withdrawAmount);
      
      const finalOwnerBalance = await token.balanceOf(owner.address);
      expect(finalOwnerBalance - initialOwnerBalance).to.equal(withdrawAmount);
    });

    it("Should allow owner to emergency withdraw", async function () {
      const faucetBalance = await token.balanceOf(await faucet.getAddress());
      const initialOwnerBalance = await token.balanceOf(owner.address);
      
      await expect(faucet.emergencyWithdraw())
        .to.emit(faucet, "EmergencyWithdrawal")
        .withArgs(faucetBalance);
      
      const finalOwnerBalance = await token.balanceOf(owner.address);
      expect(finalOwnerBalance - initialOwnerBalance).to.equal(faucetBalance);
    });
  });

  describe("Pause Functionality", function () {
    it("Should allow owner to pause the faucet", async function () {
      await faucet.pause();
      expect(await faucet.paused()).to.be.true;
    });

    it("Should not allow claims when paused", async function () {
      await faucet.pause();
      
      await expect(
        faucet.connect(user1).requestTokens()
      ).to.be.revertedWithCustomError(faucet, "EnforcedPause");
    });

    it("Should allow owner to unpause the faucet", async function () {
      await faucet.pause();
      await faucet.unpause();
      expect(await faucet.paused()).to.be.false;
    });

    it("Should allow claims after unpause", async function () {
      await faucet.pause();
      await faucet.unpause();
      
      await expect(faucet.connect(user1).requestTokens()).to.not.be.reverted;
    });
  });

  describe("View Functions", function () {
    it("Should return correct canClaim status", async function () {
      expect(await faucet.canClaim(user1.address)).to.be.true;
      
      await faucet.connect(user1).requestTokens();
      expect(await faucet.canClaim(user1.address)).to.be.false;
      
      await time.increase(COOLDOWN_TIME);
      expect(await faucet.canClaim(user1.address)).to.be.true;
    });

    it("Should return correct time until next claim", async function () {
      expect(await faucet.timeUntilNextClaim(user1.address)).to.equal(0);
      
      await faucet.connect(user1).requestTokens();
      const timeUntilNext = await faucet.timeUntilNextClaim(user1.address);
      expect(timeUntilNext).to.be.greaterThan(0);
      expect(timeUntilNext).to.be.lessThanOrEqual(COOLDOWN_TIME);
    });

    it("Should return correct faucet statistics", async function () {
      const [faucetBalance, totalClaimed, totalUsers, faucetAmount, cooldownTime] = await faucet.getFaucetStats();
      
      expect(faucetBalance).to.equal(ethers.parseEther("10000"));
      expect(totalClaimed).to.equal(0);
      expect(totalUsers).to.equal(0);
      expect(faucetAmount).to.equal(FAUCET_AMOUNT);
      expect(cooldownTime).to.equal(COOLDOWN_TIME);
    });

    it("Should return correct user statistics", async function () {
      const [lastClaim, totalClaimed, canClaim, timeUntilNext] = await faucet.getUserStats(user1.address);
      
      expect(lastClaim).to.equal(0);
      expect(totalClaimed).to.equal(0);
      expect(canClaim).to.be.true;
      expect(timeUntilNext).to.equal(0);
    });
  });
}); 