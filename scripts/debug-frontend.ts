import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Debug da interface do faucet...");
  console.log("=".repeat(50));
  
  // Endereços dos contratos deployados
  const faucetAddress = "0xb1e4C7a5919b35e30b9fB3e8deB1FA593652962E";
  
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Endereço: ${deployer.address}`);
  
  // Conectar ao contrato faucet
  const Faucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = Faucet.attach(faucetAddress);
  
  try {
    const stats = await faucet.getUserStats(deployer.address);
    const cooldownTime = await faucet.cooldownTime();
    
    console.log(`\n📊 DADOS BRUTOS DO CONTRATO:`);
    console.log(`lastClaim (timestamp): ${stats._lastClaim}`);
    console.log(`cooldownTime (seconds): ${cooldownTime}`);
    console.log(`timeUntilNext (seconds): ${stats._timeUntilNext}`);
    console.log(`canClaim: ${stats._canClaim}`);
    
    console.log(`\n🕐 CONVERSÕES DE TEMPO:`);
    
    // Timestamp atual
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const blockTimestamp = (await ethers.provider.getBlock('latest'))?.timestamp || 0;
    
    console.log(`Agora (JavaScript): ${currentTimestamp} (${new Date().toISOString()})`);
    console.log(`Agora (Block): ${blockTimestamp} (${new Date(blockTimestamp * 1000).toISOString()})`);
    
    // Cálculos corretos
    const lastClaimNumber = Number(stats._lastClaim);
    const cooldownNumber = Number(cooldownTime);
    const nextClaimTime = lastClaimNumber + cooldownNumber;
    const timeRemaining = Math.max(0, nextClaimTime - blockTimestamp);
    
    console.log(`\n📈 CÁLCULOS CORRETOS:`);
    console.log(`Última claim: ${lastClaimNumber} (${new Date(lastClaimNumber * 1000).toISOString()})`);
    console.log(`Próxima claim: ${nextClaimTime} (${new Date(nextClaimTime * 1000).toISOString()})`);
    console.log(`Tempo restante: ${timeRemaining} segundos (${timeRemaining / 3600} horas)`);
    
    console.log(`\n🌐 DADOS PARA FRONTEND:`);
    console.log(`nextClaimTimestamp: ${nextClaimTime}`);
    console.log(`remainingSeconds: ${timeRemaining}`);
    console.log(`remainingHours: ${timeRemaining / 3600}`);
    console.log(`canClaim: ${timeRemaining === 0}`);
    
    console.log(`\n⚠️  PROBLEMAS COMUNS:`);
    
    // Verificar possíveis problemas
    const jsTime = Date.now() / 1000;
    const blockTime = blockTimestamp;
    const timeDiff = Math.abs(jsTime - blockTime);
    
    console.log(`Diferença JS vs Block: ${timeDiff} segundos`);
    if (timeDiff > 300) { // 5 minutos
      console.log(`🚨 AVISO: Grande diferença entre tempo JS e blockchain!`);
    }
    
    // Verificar se o frontend está usando milliseconds ao invés de seconds
    const nextClaimMs = nextClaimTime * 1000; // Converter para milliseconds
    const timeRemainingMs = Math.max(0, nextClaimMs - Date.now());
    
    console.log(`\n🔄 Se frontend usar milliseconds:`);
    console.log(`nextClaimTimestamp (ms): ${nextClaimMs}`);
    console.log(`remainingMs: ${timeRemainingMs}`);
    console.log(`remainingHours: ${timeRemainingMs / (1000 * 3600)}`);
    
    // Simular bug comum: usar timestamp em seconds como se fosse milliseconds
    const buggyTime = nextClaimTime; // Se frontend pensa que isso está em ms
    const buggyRemaining = Math.max(0, buggyTime - Date.now());
    
    console.log(`\n🐛 BUG PROVÁVEL (timestamp em seconds usado como ms):`);
    console.log(`Remaining (buggy): ${buggyRemaining} ms`);
    console.log(`Remaining (buggy hours): ${buggyRemaining / (1000 * 3600)}`);
    
    console.log(`\n✅ CONFIGURAÇÃO CORRETA PARA FRONTEND:`);
    console.log(`{`);
    console.log(`  nextClaimTime: ${nextClaimTime}, // timestamp em seconds`);
    console.log(`  currentTime: ${blockTimestamp}, // timestamp atual em seconds`);
    console.log(`  remainingSeconds: ${timeRemaining},`);
    console.log(`  canClaim: ${timeRemaining === 0},`);
    console.log(`  cooldownHours: ${cooldownNumber / 3600}`);
    console.log(`}`);
    
  } catch (error) {
    console.log("❌ ERRO:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 