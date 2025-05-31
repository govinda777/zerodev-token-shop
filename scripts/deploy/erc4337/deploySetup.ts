import { ethers } from "hardhat";
import { CustomEntryPoint, SimplePaymaster, SmartAccount } from "../typechain-types";

async function main() {
  // Deploy EntryPoint
  const EntryPoint = await ethers.getContractFactory("CustomEntryPoint");
  const entryPoint = await EntryPoint.deploy();
  await entryPoint.deployed();
  console.log("EntryPoint deployed to:", entryPoint.address);

  // Deploy Paymaster
  const Paymaster = await ethers.getContractFactory("SimplePaymaster");
  const paymaster = await Paymaster.deploy(entryPoint.address);
  await paymaster.deployed();
  console.log("Paymaster deployed to:", paymaster.address);

  // Deploy Smart Account Factory
  const SmartAccount = await ethers.getContractFactory("SmartAccount");
  const smartAccount = await SmartAccount.deploy(entryPoint.address);
  await smartAccount.deployed();
  console.log("SmartAccount deployed to:", smartAccount.address);

  // Fund Paymaster
  const [deployer] = await ethers.getSigners();
  await deployer.sendTransaction({
    to: paymaster.address,
    value: ethers.utils.parseEther("1")
  });
  console.log("Funded Paymaster with 1 ETH");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
