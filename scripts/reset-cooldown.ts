import { ethers } from "hardhat";

async function main() {
  console.log("🔄 Resetando cooldown do faucet...");
  console.log("=".repeat(50));
  
  // Endereços dos contratos deployados
  const faucetAddress = "0xb1e4C7a5919b35e30b9fB3e8deB1FA593652962E";
  
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Executando com: ${deployer.address}`);
  
  // Conectar ao contrato faucet
  const Faucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = Faucet.attach(faucetAddress);
  
  try {
    // Verificar se há função para resetar cooldown (apenas para owner)
    console.log("\n📊 Status antes do reset:");
    const canClaim = await faucet.canClaim(deployer.address);
    console.log(`✅ Pode clamar: ${canClaim}`);
    
    if (!canClaim) {
      const timeUntilNext = await faucet.timeUntilNextClaim(deployer.address);
      const lastClaimTime = await faucet.lastClaim(deployer.address);
      
      console.log(`⏳ Tempo restante: ${Number(timeUntilNext) / 3600} horas`);
      console.log(`🕐 Última claim: ${new Date(Number(lastClaimTime) * 1000).toLocaleString()}`);
      
      // Vamos tentar resetar manualmente os dados do usuário
      console.log("\n🔄 Tentando resetar dados do usuário...");
      
      // Como o contrato não tem função de reset, vamos verificar se podemos fazer um claim simulado
      // Para isso, vamos verificar se somos o owner
      try {
        const owner = await faucet.owner();
        console.log(`👑 Owner do contrato: ${owner}`);
        console.log(`👤 Endereço atual: ${deployer.address}`);
        
        if (owner.toLowerCase() === deployer.address.toLowerCase()) {
          console.log("✅ Você é o owner - pode gerenciar o faucet");
          
          // Verificar se existe função para emergency withdraw ou reset
          console.log("\n📋 Funções disponíveis no contrato:");
          const contractInterface = faucet.interface;
          const functions = Object.keys(contractInterface.functions);
          functions.forEach(func => console.log(`  - ${func}`));
          
        } else {
          console.log("❌ Você não é o owner do contrato");
        }
        
      } catch (error) {
        console.log("❌ Erro ao verificar owner:", error);
      }
    } else {
      console.log("✅ Já pode fazer claim!");
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