import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Iniciando deploy dos contratos ZeroDev...");
  console.log("=".repeat(60));
  
  const [deployer] = await ethers.getSigners();
  console.log(`💰 Deploying com a conta: ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Saldo da conta: ${ethers.formatEther(balance)} ETH`);
  
  if (balance < ethers.parseEther("0.01")) {
    console.warn("⚠️  Saldo baixo! Certifique-se de ter ETH suficiente para o deploy.");
  }

  console.log("\n📝 ETAPA 1: Deploy do ZeroDevToken...");
  console.log("-".repeat(40));
  
  // Deploy Token
  const TokenFactory = await ethers.getContractFactory("ZeroDevToken");
  console.log("📤 Deployando ZeroDevToken...");
  
  const token = await TokenFactory.deploy();
  await token.waitForDeployment();
  
  const tokenAddress = await token.getAddress();
  console.log(`✅ ZeroDevToken deployed to: ${tokenAddress}`);
  
  // Verificar deploy do token
  const tokenName = await token.name();
  const tokenSymbol = await token.symbol();
  const tokenDecimals = await token.decimals();
  const totalSupply = await token.totalSupply();
  
  console.log(`📊 Token Info:`);
  console.log(`   Nome: ${tokenName}`);
  console.log(`   Símbolo: ${tokenSymbol}`);
  console.log(`   Decimais: ${tokenDecimals}`);
  console.log(`   Supply Total: ${ethers.formatEther(totalSupply)} ${tokenSymbol}`);

  console.log("\n📝 ETAPA 2: Deploy do TokenFaucet...");
  console.log("-".repeat(40));
  
  // Deploy Faucet
  const FaucetFactory = await ethers.getContractFactory("TokenFaucet");
  console.log("📤 Deployando TokenFaucet...");
  
  const faucet = await FaucetFactory.deploy(tokenAddress);
  await faucet.waitForDeployment();
  
  const faucetAddress = await faucet.getAddress();
  console.log(`✅ TokenFaucet deployed to: ${faucetAddress}`);
  
  // Verificar configurações do faucet
  const faucetAmount = await faucet.faucetAmount();
  const cooldownTime = await faucet.cooldownTime();
  
  console.log(`📊 Faucet Info:`);
  console.log(`   Amount per claim: ${ethers.formatEther(faucetAmount)} ${tokenSymbol}`);
  console.log(`   Cooldown: ${cooldownTime.toString()} segundos (${Number(cooldownTime) / 3600} horas)`);

  console.log("\n📝 ETAPA 3: Configuração inicial...");
  console.log("-".repeat(40));
  
  // Transfer tokens to faucet (100k tokens = 10% do supply)
  const faucetSupply = ethers.parseEther("100000");
  console.log(`📤 Transferindo ${ethers.formatEther(faucetSupply)} ${tokenSymbol} para o faucet...`);
  
  const transferTx = await token.transfer(faucetAddress, faucetSupply);
  await transferTx.wait();
  
  // Verificar saldo do faucet
  const faucetBalance = await token.balanceOf(faucetAddress);
  console.log(`✅ Faucet balance: ${ethers.formatEther(faucetBalance)} ${tokenSymbol}`);
  
  // Calcular quantos claims são possíveis
  const possibleClaims = faucetBalance / faucetAmount;
  console.log(`📊 Claims possíveis: ${possibleClaims.toString()}`);

  console.log("\n📝 ETAPA 4: Verificações finais...");
  console.log("-".repeat(40));
  
  // Testar algumas funções
  console.log("🧪 Testando funções do faucet...");
  
  const canClaim = await faucet.canClaim(deployer.address);
  console.log(`   Deployer pode clamar: ${canClaim}`);
  
  const [faucetBalanceStats, totalClaimed, totalUsers, faucetAmountStats, cooldownStats] = await faucet.getFaucetStats();
  console.log(`📊 Estatísticas do Faucet:`);
  console.log(`   Balance: ${ethers.formatEther(faucetBalanceStats)} ${tokenSymbol}`);
  console.log(`   Total claimed: ${ethers.formatEther(totalClaimed)} ${tokenSymbol}`);
  console.log(`   Total users: ${totalUsers.toString()}`);

  console.log("\n📝 ETAPA 5: Salvando informações...");
  console.log("-".repeat(40));
  
  // Salvar endereços em arquivo
  const deploymentInfo = {
    network: "sepolia",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      ZeroDevToken: {
        address: tokenAddress,
        name: tokenName,
        symbol: tokenSymbol,
        decimals: Number(tokenDecimals),
        totalSupply: ethers.formatEther(totalSupply)
      },
      TokenFaucet: {
        address: faucetAddress,
        tokenAddress: tokenAddress,
        faucetAmount: ethers.formatEther(faucetAmount),
        cooldownTime: Number(cooldownTime),
        initialBalance: ethers.formatEther(faucetBalance)
      }
    },
    transactions: {
      tokenDeploy: token.deploymentTransaction()?.hash,
      faucetDeploy: faucet.deploymentTransaction()?.hash,
      tokenTransfer: transferTx.hash
    }
  };
  
  const deploymentPath = path.join(__dirname, "..", "deployments", "sepolia.json");
  
  // Criar diretório se não existir
  const deploymentDir = path.dirname(deploymentPath);
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 Informações salvas em: ${deploymentPath}`);

  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOY CONCLUÍDO COM SUCESSO!");
  console.log("=".repeat(60));
  
  console.log("\n📋 RESUMO DO DEPLOYMENT:");
  console.log(`🪙 Token Address: ${tokenAddress}`);
  console.log(`🚰 Faucet Address: ${faucetAddress}`);
  console.log(`💰 Faucet Supply: ${ethers.formatEther(faucetBalance)} ${tokenSymbol}`);
  console.log(`🎯 Amount per Claim: ${ethers.formatEther(faucetAmount)} ${tokenSymbol}`);
  console.log(`⏰ Cooldown: ${Number(cooldownTime) / 3600} horas`);
  console.log(`🔢 Possible Claims: ${possibleClaims.toString()}`);
  
  console.log("\n🔧 PRÓXIMOS PASSOS:");
  console.log("1. Adicione as seguintes variáveis ao seu .env:");
  console.log(`   NEXT_PUBLIC_TOKEN_CONTRACT=${tokenAddress}`);
  console.log(`   NEXT_PUBLIC_FAUCET_CONTRACT=${faucetAddress}`);
  console.log("");
  console.log("2. Verifique os contratos no Etherscan:");
  console.log(`   npx hardhat verify --network sepolia ${tokenAddress}`);
  console.log(`   npx hardhat verify --network sepolia ${faucetAddress} ${tokenAddress}`);
  console.log("");
  console.log("3. Teste o faucet fazendo um claim:");
  console.log(`   npx hardhat run scripts/test-claim.ts --network sepolia`);
  
  console.log("\n📊 ETHERSCAN LINKS:");
  console.log(`🪙 Token: https://sepolia.etherscan.io/address/${tokenAddress}`);
  console.log(`🚰 Faucet: https://sepolia.etherscan.io/address/${faucetAddress}`);
  
  console.log("\n" + "=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ ERRO NO DEPLOY:", error);
    process.exit(1);
  }); 