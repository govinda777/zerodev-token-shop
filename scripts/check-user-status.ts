import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Verificando status do usuário...");
  console.log("=".repeat(50));
  
  // Endereços dos contratos deployados
  const tokenAddress = "0xcac5c82D2523c5986D80620061500dAAb94A9B8c";
  const faucetAddress = "0xb1e4C7a5919b35e30b9fB3e8deB1FA593652962E";
  
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Verificando usuário: ${deployer.address}`);
  
  // Conectar aos contratos
  const Token = await ethers.getContractFactory("ZeroDevToken");
  const token = Token.attach(tokenAddress);
  
  const Faucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = Faucet.attach(faucetAddress);
  
  try {
    console.log(`\n💰 SALDO DE TOKENS:`);
    const balance = await token.balanceOf(deployer.address);
    console.log(`Saldo atual: ${ethers.formatEther(balance)} ZDT`);
    
    console.log(`\n🚰 STATUS DO FAUCET:`);
    const stats = await faucet.getUserStats(deployer.address);
    
    console.log(`Última claim: ${stats._lastClaim}`);
    console.log(`Total reclamado: ${ethers.formatEther(stats._totalClaimed)} ZDT`);
    console.log(`Pode clamar agora: ${stats._canClaim}`);
    console.log(`Tempo até próxima: ${Number(stats._timeUntilNext)} segundos`);
    
    // Verificar se o usuário já fez algum claim
    const hasUsedFaucet = Number(stats._lastClaim) > 0;
    const totalClaims = Number(stats._totalClaimed) / Number(await faucet.faucetAmount());
    
    console.log(`\n📊 ANÁLISE:`);
    console.log(`Já usou o faucet: ${hasUsedFaucet}`);
    console.log(`Total de claims feitos: ${totalClaims}`);
    console.log(`Total de tokens do faucet: ${ethers.formatEther(stats._totalClaimed)} ZDT`);
    
    if (hasUsedFaucet) {
      console.log(`\n✅ MISSÃO FAUCET DEVERIA ESTAR COMPLETA!`);
      console.log(`Data da última claim: ${new Date(Number(stats._lastClaim) * 1000).toLocaleString()}`);
      
      // Verificar se pode fazer nova claim
      if (stats._canClaim) {
        console.log(`🎯 Pode fazer nova claim agora!`);
      } else {
        const hoursRemaining = Number(stats._timeUntilNext) / 3600;
        console.log(`⏰ Próxima claim em: ${hoursRemaining.toFixed(2)} horas`);
      }
    } else {
      console.log(`\n❌ Usuário ainda não usou o faucet`);
      console.log(`🎯 Precisa fazer o primeiro claim para completar a missão`);
    }
    
    // Verificar se é o owner (para verificar permissões)
    try {
      const owner = await faucet.owner();
      console.log(`\n👑 Owner do faucet: ${owner}`);
      console.log(`É o owner: ${owner.toLowerCase() === deployer.address.toLowerCase()}`);
    } catch (error) {
      console.log(`❌ Erro ao verificar owner: ${error}`);
    }
    
  } catch (error) {
    console.log("❌ ERRO:", error);
  }
  
  console.log(`\n📋 AÇÕES RECOMENDADAS:`);
  console.log(`1. Se já fez claim: Verifique se o frontend está detectando corretamente`);
  console.log(`2. Se não fez claim: Acesse o frontend e faça o primeiro claim`);
  console.log(`3. Certifique-se de estar logado com a mesma carteira: ${deployer.address}`);
  console.log(`4. Frontend rodando em: http://localhost:3001`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 