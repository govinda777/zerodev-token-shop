import { ethers } from "hardhat";

async function main() {
  console.log("⏰ Reduzindo cooldown do faucet para teste...");
  console.log("=".repeat(50));
  
  // Endereços dos contratos deployados
  const faucetAddress = "0xb1e4C7a5919b35e30b9fB3e8deB1FA593652962E";
  
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Executando com: ${deployer.address}`);
  
  // Conectar ao contrato faucet
  const Faucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = Faucet.attach(faucetAddress);
  
  try {
    // Verificar status atual
    const stats = await faucet.getUserStats(deployer.address);
    console.log(`\n📊 Status atual:`);
    console.log(`🕐 Última claim: ${new Date(Number(stats._lastClaim) * 1000).toLocaleString()}`);
    console.log(`💰 Total reclamado: ${ethers.formatEther(stats._totalClaimed)} ZDT`);
    console.log(`✅ Pode clamar: ${stats._canClaim}`);
    console.log(`⏳ Tempo restante: ${Number(stats._timeUntilNext) / 3600} horas`);
    
    // Verificar cooldown atual
    const cooldownTime = await faucet.cooldownTime();
    console.log(`⏱️  Cooldown atual: ${Number(cooldownTime) / 3600} horas`);
    
    // Reduzir cooldown para 1 minuto (60 segundos) temporariamente
    const newCooldown = 60; // 1 minuto
    console.log(`\n🔄 Reduzindo cooldown para ${newCooldown} segundos...`);
    
    const tx = await faucet.setCooldownTime(newCooldown);
    console.log(`📝 Hash da transação: ${tx.hash}`);
    
    await tx.wait();
    console.log("✅ Cooldown atualizado!");
    
    // Verificar novo status
    const newStats = await faucet.getUserStats(deployer.address);
    console.log(`\n📊 Novo status:`);
    console.log(`✅ Pode clamar: ${newStats._canClaim}`);
    console.log(`⏳ Tempo restante: ${Number(newStats._timeUntilNext)} segundos`);
    
    if (newStats._canClaim) {
      console.log("🎉 Agora você pode fazer claim!");
    } else {
      console.log(`⏰ Aguarde ${Number(newStats._timeUntilNext)} segundos`);
    }
    
    console.log(`\n⚠️  LEMBRE-SE: Após testar, execute o script para restaurar o cooldown para 24 horas!`);
    
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