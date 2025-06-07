import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroDevToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("ZeroDevToken", function () {
  let token: ZeroDevToken;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("ZeroDevToken");
    token = await TokenFactory.deploy();
    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct name and symbol", async function () {
      expect(await token.name()).to.equal("ZeroDev Token");
      expect(await token.symbol()).to.equal("ZDT");
    });

    it("Should have 18 decimals", async function () {
      expect(await token.decimals()).to.equal(18);
    });

    it("Should have initial supply of 1M tokens", async function () {
      const expectedSupply = ethers.parseEther("1000000");
      expect(await token.totalSupply()).to.equal(expectedSupply);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const amount = ethers.parseEther("50");
      
      await token.transfer(addr1.address, amount);
      expect(await token.balanceOf(addr1.address)).to.equal(amount);

      await token.connect(addr1).transfer(addr2.address, amount);
      expect(await token.balanceOf(addr2.address)).to.equal(amount);
      expect(await token.balanceOf(addr1.address)).to.equal(0);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);
      const amount = ethers.parseEther("1");

      await expect(
        token.connect(addr1).transfer(owner.address, amount)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");

      expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);
      const amount1 = ethers.parseEther("100");
      const amount2 = ethers.parseEther("50");

      await token.transfer(addr1.address, amount1);
      await token.transfer(addr2.address, amount2);

      const finalOwnerBalance = await token.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - amount1 - amount2);

      expect(await token.balanceOf(addr1.address)).to.equal(amount1);
      expect(await token.balanceOf(addr2.address)).to.equal(amount2);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const amount = ethers.parseEther("1000");
      const initialSupply = await token.totalSupply();
      
      await token.mint(addr1.address, amount);
      
      expect(await token.balanceOf(addr1.address)).to.equal(amount);
      expect(await token.totalSupply()).to.equal(initialSupply + amount);
    });

    it("Should not allow non-owner to mint tokens", async function () {
      const amount = ethers.parseEther("1000");
      
      await expect(
        token.connect(addr1).mint(addr2.address, amount)
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });

    it("Should emit TokensMinted event", async function () {
      const amount = ethers.parseEther("1000");
      
      await expect(token.mint(addr1.address, amount))
        .to.emit(token, "TokensMinted")
        .withArgs(addr1.address, amount);
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      const amount = ethers.parseEther("1000");
      await token.transfer(addr1.address, amount);
    });

    it("Should allow users to burn their tokens", async function () {
      const burnAmount = ethers.parseEther("500");
      const initialBalance = await token.balanceOf(addr1.address);
      const initialSupply = await token.totalSupply();
      
      await token.connect(addr1).burn(burnAmount);
      
      expect(await token.balanceOf(addr1.address)).to.equal(initialBalance - burnAmount);
      expect(await token.totalSupply()).to.equal(initialSupply - burnAmount);
    });

    it("Should not allow burning more tokens than balance", async function () {
      const burnAmount = ethers.parseEther("2000");
      
      await expect(
        token.connect(addr1).burn(burnAmount)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
    });

    it("Should emit TokensBurned event", async function () {
      const burnAmount = ethers.parseEther("500");
      
      await expect(token.connect(addr1).burn(burnAmount))
        .to.emit(token, "TokensBurned")
        .withArgs(addr1.address, burnAmount);
    });

    it("Should allow burning from approved account", async function () {
      const burnAmount = ethers.parseEther("500");
      const initialSupply = await token.totalSupply();
      
      // addr1 approves addr2 to spend tokens
      await token.connect(addr1).approve(addr2.address, burnAmount);
      
      // addr2 burns from addr1's balance
      await token.connect(addr2).burnFrom(addr1.address, burnAmount);
      
      expect(await token.balanceOf(addr1.address)).to.equal(
        ethers.parseEther("1000") - burnAmount
      );
      expect(await token.totalSupply()).to.equal(initialSupply - burnAmount);
    });

    it("Should not allow burning from account without approval", async function () {
      const burnAmount = ethers.parseEther("500");
      
      await expect(
        token.connect(addr2).burnFrom(addr1.address, burnAmount)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
    });
  });

  describe("Events", function () {
    it("Should emit Transfer event on token transfer", async function () {
      const amount = ethers.parseEther("100");
      
      await expect(token.transfer(addr1.address, amount))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, addr1.address, amount);
    });

    it("Should emit Approval event on token approval", async function () {
      const amount = ethers.parseEther("100");
      
      await expect(token.approve(addr1.address, amount))
        .to.emit(token, "Approval")
        .withArgs(owner.address, addr1.address, amount);
    });
  });
}); 