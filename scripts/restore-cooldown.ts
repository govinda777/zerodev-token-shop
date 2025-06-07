import { ethers } from "hardhat";

async function main() {
  console.log("🔄 Restaurando cooldown do faucet para 24 horas...");
  console.log("=".repeat(50));
  
  // Endereços dos contratos deployados
  const faucetAddress = "0xb1e4C7a5919b35e30b9fB3e8deB1FA593652962E";
  
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Executando com: ${deployer.address}`);
  
  // Conectar ao contrato faucet
  const Faucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = Faucet.attach(faucetAddress);
  
  try {
    // Verificar cooldown atual
    const currentCooldown = await faucet.cooldownTime();
    console.log(`⏱️  Cooldown atual: ${Number(currentCooldown) / 3600} horas`);
    
    // Restaurar cooldown para 24 horas
    const newCooldown = 24 * 60 * 60; // 24 horas em segundos
    console.log(`\n🔄 Restaurando cooldown para ${newCooldown / 3600} horas...`);
    
    const tx = await faucet.setCooldownTime(newCooldown);
    console.log(`📝 Hash da transação: ${tx.hash}`);
    
    await tx.wait();
    console.log("✅ Cooldown restaurado!");
    
    // Verificar status após restauração
    const stats = await faucet.getUserStats(deployer.address);
    console.log(`\n📊 Status após restauração:`);
    console.log(`✅ Pode clamar: ${stats._canClaim}`);
    console.log(`⏳ Tempo restante: ${Number(stats._timeUntilNext) / 3600} horas`);
    
    const finalCooldown = await faucet.cooldownTime();
    console.log(`⏱️  Cooldown final: ${Number(finalCooldown) / 3600} horas`);
    
    console.log(`\n✅ Cooldown restaurado para 24 horas com sucesso!`);
    
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