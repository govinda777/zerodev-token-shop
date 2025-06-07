import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🔧 Completando setup do faucet...");
  console.log("=".repeat(50));
  
  // Endereços dos contratos deployados
  const tokenAddress = "0xcac5c82D2523c5986D80620061500dAAb94A9B8c";
  const faucetAddress = "0xb1e4C7a5919b35e30b9fB3e8deB1FA593652962E";
  
  const [deployer] = await ethers.getSigners();
  console.log(`💰 Configurando com a conta: ${deployer.address}`);
  
  // Conectar aos contratos
  const Token = await ethers.getContractFactory("ZeroDevToken");
  const token = Token.attach(tokenAddress);
  
  const Faucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = Faucet.attach(faucetAddress);
  
  console.log("\n📊 Verificando status atual...");
  
  // Verificar saldos
  const deployerBalance = await token.balanceOf(deployer.address);
  const faucetBalance = await token.balanceOf(faucetAddress);
  
  console.log(`   Deployer balance: ${ethers.formatEther(deployerBalance)} ZDT`);
  console.log(`   Faucet balance: ${ethers.formatEther(faucetBalance)} ZDT`);
  
  // Se o faucet não tem tokens, transferir
  if (faucetBalance < ethers.parseEther("1000")) {
    console.log("\n📤 Transferindo tokens para o faucet...");
    const transferAmount = ethers.parseEther("100000"); // 100k tokens
    
    const transferTx = await token.transfer(faucetAddress, transferAmount);
    console.log(`   Tx hash: ${transferTx.hash}`);
    await transferTx.wait();
    
    const newFaucetBalance = await token.balanceOf(faucetAddress);
    console.log(`   ✅ Novo saldo do faucet: ${ethers.formatEther(newFaucetBalance)} ZDT`);
  }
  
  // Obter informações dos contratos
  const tokenName = await token.name();
  const tokenSymbol = await token.symbol();
  const totalSupply = await token.totalSupply();
  const faucetAmount = await faucet.faucetAmount();
  const cooldownTime = await faucet.cooldownTime();
  const finalFaucetBalance = await token.balanceOf(faucetAddress);
  
  console.log("\n💾 Salvando informações de deployment...");
  
  // Criar arquivo de deployment
  const deploymentInfo = {
    network: "sepolia",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      ZeroDevToken: {
        address: tokenAddress,
        name: tokenName,
        symbol: tokenSymbol,
        decimals: 18,
        totalSupply: ethers.formatEther(totalSupply)
      },
      TokenFaucet: {
        address: faucetAddress,
        tokenAddress: tokenAddress,
        faucetAmount: ethers.formatEther(faucetAmount),
        cooldownTime: Number(cooldownTime),
        balance: ethers.formatEther(finalFaucetBalance)
      }
    }
  };
  
  const deploymentPath = path.join(__dirname, "..", "deployments", "sepolia.json");
  
  // Criar diretório se não existir
  const deploymentDir = path.dirname(deploymentPath);
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`   ✅ Salvo em: ${deploymentPath}`);
  
  console.log("\n" + "=".repeat(50));
  console.log("🎉 SETUP CONCLUÍDO COM SUCESSO!");
  console.log("=".repeat(50));
  
  console.log("\n📋 INFORMAÇÕES DOS CONTRATOS:");
  console.log(`🪙 Token: ${tokenAddress}`);
  console.log(`🚰 Faucet: ${faucetAddress}`);
  console.log(`💰 Faucet Balance: ${ethers.formatEther(finalFaucetBalance)} ${tokenSymbol}`);
  console.log(`🎯 Amount per Claim: ${ethers.formatEther(faucetAmount)} ${tokenSymbol}`);
  console.log(`⏰ Cooldown: ${Number(cooldownTime) / 3600} horas`);
  
  console.log("\n🔧 ADICIONE AO SEU .env:");
  console.log(`NEXT_PUBLIC_TOKEN_CONTRACT=${tokenAddress}`);
  console.log(`NEXT_PUBLIC_FAUCET_CONTRACT=${faucetAddress}`);
  
  console.log("\n🌐 ETHERSCAN LINKS:");
  console.log(`🪙 Token: https://sepolia.etherscan.io/address/${tokenAddress}`);
  console.log(`🚰 Faucet: https://sepolia.etherscan.io/address/${faucetAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ ERRO:", error);
    process.exit(1);
  }); 