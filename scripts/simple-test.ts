import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Teste simples do faucet...");
  console.log("=".repeat(50));
  
  // Endereços dos contratos deployados
  const tokenAddress = "0xcac5c82D2523c5986D80620061500dAAb94A9B8c";
  const faucetAddress = "0xb1e4C7a5919b35e30b9fB3e8deB1FA593652962E";
  
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Testando com: ${deployer.address}`);
  
  // Conectar aos contratos
  const Token = await ethers.getContractFactory("ZeroDevToken");
  const token = Token.attach(tokenAddress);
  
  const Faucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = Faucet.attach(faucetAddress);
  
  console.log(`🪙 Token: ${tokenAddress}`);
  console.log(`🚰 Faucet: ${faucetAddress}`);
  
  try {
    // Verificar saldo do faucet
    const faucetBalance = await token.balanceOf(faucetAddress);
    console.log(`💰 Saldo do faucet: ${ethers.formatEther(faucetBalance)} ZDT`);
    
    // Verificar se pode clamar
    const canClaim = await faucet.canClaim(deployer.address);
    console.log(`✅ Pode clamar: ${canClaim}`);
    
    if (!canClaim) {
      const timeUntilNext = await faucet.timeUntilNextClaim(deployer.address);
      console.log(`⏳ Próxima claim em: ${Number(timeUntilNext) / 3600} horas`);
      return;
    }
    
    // Fazer claim
    console.log("📤 Executando requestTokens()...");
    const tx = await faucet.requestTokens();
    console.log(`📋 Hash da transação: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`✅ Transação confirmada!`);
    
    // Verificar novo saldo
    const newBalance = await token.balanceOf(deployer.address);
    console.log(`🎉 Saldo atualizado: ${ethers.formatEther(newBalance)} ZDT`);
    
    console.log("\n🎉 FAUCET FUNCIONANDO PERFEITAMENTE!");
    
  } catch (error: any) {
    console.error("❌ Erro:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ ERRO NO TESTE:", error);
    process.exit(1);
  }); 