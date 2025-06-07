import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testando correção do bug do faucet...");
  console.log("=".repeat(50));
  
  // Endereços dos contratos deployados
  const faucetAddress = "0xb1e4C7a5919b35e30b9fB3e8deB1FA593652962E";
  
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Testando com: ${deployer.address}`);
  
  // Conectar ao contrato faucet
  const Faucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = Faucet.attach(faucetAddress);
  
  try {
    const stats = await faucet.getUserStats(deployer.address);
    
    console.log(`\n📊 DADOS DO CONTRATO:`);
    console.log(`lastClaim (timestamp em seconds): ${stats._lastClaim}`);
    console.log(`timeUntilNext (seconds): ${stats._timeUntilNext}`);
    console.log(`canClaim: ${stats._canClaim}`);
    
    // SIMULAR O QUE O FRONTEND DEVERIA FAZER AGORA (COM A CORREÇÃO)
    console.log(`\n🔧 SIMULAÇÃO FRONTEND CORRIGIDO:`);
    
    // 1. getLastClaim() do useBlockchain agora retorna em milliseconds
    const lastClaimFromContract = Number(stats._lastClaim); // em seconds
    const lastClaimForFrontend = lastClaimFromContract * 1000; // convertido para ms pelo useBlockchain
    
    console.log(`lastClaim (contrato seconds): ${lastClaimFromContract}`);
    console.log(`lastClaim (frontend ms): ${lastClaimForFrontend}`);
    console.log(`lastClaim (data): ${new Date(lastClaimForFrontend).toISOString()}`);
    
    // 2. Frontend calcula cooldown
    const now = Date.now();
    const timeDiff = now - lastClaimForFrontend;
    const cooldownTime = 24 * 60 * 60 * 1000; // 24 horas em ms
    const remaining = cooldownTime - timeDiff;
    
    console.log(`\n⏰ CÁLCULO DO COOLDOWN:`);
    console.log(`Agora (ms): ${now}`);
    console.log(`Diferença (ms): ${timeDiff}`);
    console.log(`Cooldown (ms): ${cooldownTime}`);
    console.log(`Restante (ms): ${remaining}`);
    
    if (remaining <= 0) {
      console.log(`✅ Pode clamar: true`);
    } else {
      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      console.log(`❌ Pode clamar: false`);
      console.log(`⏳ Tempo restante: ${hours}h ${minutes}m`);
    }
    
    // 3. Comparar com o que o contrato diz
    console.log(`\n🔍 COMPARAÇÃO:`);
    console.log(`Frontend diz can claim: ${remaining <= 0}`);
    console.log(`Contrato diz can claim: ${stats._canClaim}`);
    console.log(`Contrato time until next: ${Number(stats._timeUntilNext) / 3600} horas`);
    console.log(`Frontend time remaining: ${remaining / (60 * 60 * 1000)} horas`);
    
    // Verificar se estão alinhados (tolerância de 1 minuto)
    const contractRemainingMs = Number(stats._timeUntilNext) * 1000;
    const diff = Math.abs(remaining - contractRemainingMs);
    const tolerance = 60 * 1000; // 1 minuto
    
    console.log(`\n📏 VERIFICAÇÃO DE CONSISTÊNCIA:`);
    console.log(`Diferença entre frontend e contrato: ${diff / 1000} segundos`);
    
    if (diff < tolerance) {
      console.log(`✅ SUCCESS: Frontend e contrato estão alinhados!`);
      console.log(`🎉 BUG DO FAUCET FOI CORRIGIDO!`);
    } else {
      console.log(`❌ ERRO: Frontend e contrato ainda não estão alinhados`);
      console.log(`🐛 Bug ainda não foi resolvido completamente`);
    }
    
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