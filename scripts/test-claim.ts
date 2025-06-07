import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🧪 Testando funcionamento do faucet...");
  console.log("=".repeat(50));
  
  // Carregar informações do deployment
  const deploymentPath = path.join(__dirname, "..", "deployments", "sepolia.json");
  
  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ Arquivo de deployment não encontrado!");
    console.log("💡 Execute 'npm run deploy:sepolia' primeiro.");
    process.exit(1);
  }
  
  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const tokenAddress = deploymentInfo.contracts.ZeroDevToken.address;
  const faucetAddress = deploymentInfo.contracts.TokenFaucet.address;
  
  console.log(`🪙 Token: ${tokenAddress}`);
  console.log(`🚰 Faucet: ${faucetAddress}`);
  
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Testando com: ${deployer.address}`);
  
  // Conectar aos contratos
  const tokenFactory = await ethers.getContractFactory("ZeroDevToken");
  const token = tokenFactory.attach(tokenAddress);
  
  const faucetFactory = await ethers.getContractFactory("TokenFaucet");
  const faucet = faucetFactory.attach(faucetAddress);

  console.log("\n📝 ETAPA 1: Status inicial...");
  console.log("-".repeat(30));
  
  // Verificar saldos iniciais
  const initialBalance = await token.balanceOf(deployer.address);
  const faucetBalance = await token.balanceOf(faucetAddress);
  const faucetAmount = await faucet.faucetAmount();
  
  console.log(`💰 Saldo inicial do usuário: ${ethers.formatEther(initialBalance)} ZDT`);
  console.log(`🏦 Saldo do faucet: ${ethers.formatEther(faucetBalance)} ZDT`);
  console.log(`🎯 Amount per claim: ${ethers.formatEther(faucetAmount)} ZDT`);
  
  // Verificar se pode clamar
  const canClaim = await faucet.canClaim(deployer.address);
  console.log(`✅ Pode clamar: ${canClaim}`);
  
  if (!canClaim) {
    const [lastClaim, totalClaimed, _canClaim, timeUntilNext] = await faucet.getUserStats(deployer.address);
    console.log(`⏰ Última claim: ${new Date(Number(lastClaim) * 1000).toLocaleString()}`);
    console.log(`⏳ Tempo até próxima claim: ${timeUntilNext} segundos`);
    console.log("ℹ️  Usuário ainda está em cooldown.");
    return;
  }

  console.log("\n📝 ETAPA 2: Fazendo claim...");
  console.log("-".repeat(30));
  
  try {
    console.log("📤 Executando requestTokens()...");
    
    const tx = await faucet.requestTokens();
    console.log(`📋 Hash da transação: ${tx.hash}`);
    
    console.log("⏳ Aguardando confirmação...");
    const receipt = await tx.wait();
    
    console.log(`✅ Transação confirmada! Gas usado: ${receipt?.gasUsed.toString()}`);
    
    // Verificar saldos após claim
    const newBalance = await token.balanceOf(deployer.address);
    const newFaucetBalance = await token.balanceOf(faucetAddress);
    
    const balanceDiff = newBalance - initialBalance;
    const faucetDiff = faucetBalance - newFaucetBalance;
    
    console.log(`🎉 Saldo final do usuário: ${ethers.formatEther(newBalance)} ZDT`);
    console.log(`📈 Tokens recebidos: ${ethers.formatEther(balanceDiff)} ZDT`);
    console.log(`🏦 Novo saldo do faucet: ${ethers.formatEther(newFaucetBalance)} ZDT`);
    console.log(`📉 Tokens enviados pelo faucet: ${ethers.formatEther(faucetDiff)} ZDT`);
    
    // Verificar eventos
    if (receipt?.logs) {
      console.log(`📊 Eventos emitidos: ${receipt.logs.length}`);
      
      for (const log of receipt.logs) {
        try {
          const parsedLog = faucet.interface.parseLog({
            topics: log.topics as string[],
            data: log.data
          });
          
          if (parsedLog?.name === "TokensClaimed") {
            console.log(`🎯 Evento TokensClaimed:`);
            console.log(`   Usuário: ${parsedLog.args.user}`);
            console.log(`   Amount: ${ethers.formatEther(parsedLog.args.amount)} ZDT`);
            console.log(`   Timestamp: ${new Date(Number(parsedLog.args.timestamp) * 1000).toLocaleString()}`);
          }
        } catch (e) {
          // Log pode ser de outro contrato
        }
      }
    }
    
  } catch (error: any) {
    console.error("❌ Erro ao fazer claim:", error.message);
    
    if (error.message.includes("CooldownNotPassed")) {
      console.log("⏰ Usuário ainda está em período de cooldown");
    } else if (error.message.includes("InsufficientFaucetBalance")) {
      console.log("💸 Faucet não tem saldo suficiente");
    } else {
      console.log("🔍 Erro detalhado:", error);
    }
    return;
  }

  console.log("\n📝 ETAPA 3: Verificações finais...");
  console.log("-".repeat(30));
  
  // Estatísticas finais
  const [faucetBalanceFinal, totalClaimed, totalUsers, faucetAmountFinal, cooldownTime] = await faucet.getFaucetStats();
  
  console.log(`📊 Estatísticas finais do faucet:`);
  console.log(`   Balance: ${ethers.formatEther(faucetBalanceFinal)} ZDT`);
  console.log(`   Total claimed: ${ethers.formatEther(totalClaimed)} ZDT`);
  console.log(`   Total users: ${totalUsers.toString()}`);
  console.log(`   Claims restantes: ${(faucetBalanceFinal / faucetAmountFinal).toString()}`);
  
  // Verificar se ainda pode clamar (deve ser false agora)
  const canClaimAfter = await faucet.canClaim(deployer.address);
  console.log(`🔒 Pode clamar novamente: ${canClaimAfter}`);
  
  if (!canClaimAfter) {
    const timeUntilNext = await faucet.timeUntilNextClaim(deployer.address);
    console.log(`⏳ Próxima claim em: ${Number(timeUntilNext) / 3600} horas`);
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎉 TESTE CONCLUÍDO COM SUCESSO!");
  console.log("=".repeat(50));
  
  console.log("\n📊 RESUMO:");
  console.log(`✅ Claim executado com sucesso`);
  console.log(`🪙 Tokens recebidos: ${ethers.formatEther(faucetAmount)} ZDT`);
  console.log(`⏰ Cooldown ativado: ${Number(cooldownTime) / 3600} horas`);
  
  console.log("\n🚀 PRÓXIMOS PASSOS:");
  console.log("1. ✅ Faucet funcionando corretamente");
  console.log("2. 🔄 Atualize o frontend para usar os contratos reais");
  console.log("3. 🧪 Teste no frontend da aplicação");
  console.log("4. 📢 Compartilhe os endereços com os usuários");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ ERRO NO TESTE:", error);
    process.exit(1);
  }); 