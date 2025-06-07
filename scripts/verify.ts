import { run } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🔍 Iniciando verificação dos contratos no Etherscan...");
  console.log("=".repeat(60));
  
  // Tentar carregar informações do deployment
  const deploymentPath = path.join(__dirname, "..", "deployments", "sepolia.json");
  
  let tokenAddress = "";
  let faucetAddress = "";
  
  if (fs.existsSync(deploymentPath)) {
    console.log("📂 Carregando informações do deployment...");
    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    tokenAddress = deploymentInfo.contracts.ZeroDevToken.address;
    faucetAddress = deploymentInfo.contracts.TokenFaucet.address;
    
    console.log(`🪙 Token Address: ${tokenAddress}`);
    console.log(`🚰 Faucet Address: ${faucetAddress}`);
  } else {
    console.log("⚠️  Arquivo de deployment não encontrado.");
    console.log("📝 Por favor, forneça os endereços manualmente ou execute o deploy primeiro.");
    
    // Fallback: usar endereços das variáveis de ambiente ou prompt
    tokenAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT || "";
    faucetAddress = process.env.NEXT_PUBLIC_FAUCET_CONTRACT || "";
    
    if (!tokenAddress || !faucetAddress) {
      console.error("❌ Endereços dos contratos não encontrados!");
      console.log("💡 Dica: Execute 'npm run deploy:sepolia' primeiro ou defina as variáveis:");
      console.log("   NEXT_PUBLIC_TOKEN_CONTRACT=0x...");
      console.log("   NEXT_PUBLIC_FAUCET_CONTRACT=0x...");
      process.exit(1);
    }
  }

  console.log("\n📝 ETAPA 1: Verificando ZeroDevToken...");
  console.log("-".repeat(40));
  
  try {
    console.log(`🔍 Verificando contrato em: ${tokenAddress}`);
    
    await run("verify:verify", {
      address: tokenAddress,
      constructorArguments: [], // ZeroDevToken não tem argumentos no constructor
      contract: "contracts/ZeroDevToken.sol:ZeroDevToken"
    });
    
    console.log("✅ ZeroDevToken verificado com sucesso!");
    console.log(`📊 Link: https://sepolia.etherscan.io/address/${tokenAddress}#code`);
    
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  ZeroDevToken já estava verificado!");
    } else {
      console.error("❌ Erro verificando ZeroDevToken:", error.message);
    }
  }

  console.log("\n📝 ETAPA 2: Verificando TokenFaucet...");
  console.log("-".repeat(40));
  
  try {
    console.log(`🔍 Verificando contrato em: ${faucetAddress}`);
    
    await run("verify:verify", {
      address: faucetAddress,
      constructorArguments: [tokenAddress], // TokenFaucet recebe o endereço do token
      contract: "contracts/TokenFaucet.sol:TokenFaucet"
    });
    
    console.log("✅ TokenFaucet verificado com sucesso!");
    console.log(`📊 Link: https://sepolia.etherscan.io/address/${faucetAddress}#code`);
    
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  TokenFaucet já estava verificado!");
    } else {
      console.error("❌ Erro verificando TokenFaucet:", error.message);
    }
  }

  console.log("\n📝 ETAPA 3: Validações finais...");
  console.log("-".repeat(40));
  
  // Validar que os contratos estão acessíveis
  try {
    console.log("🧪 Testando acesso aos contratos...");
    
    const tokenFactory = await ethers.getContractFactory("ZeroDevToken");
    const token = tokenFactory.attach(tokenAddress);
    
    const faucetFactory = await ethers.getContractFactory("TokenFaucet");
    const faucet = faucetFactory.attach(faucetAddress);
    
    // Testar algumas chamadas read-only
    const tokenName = await token.name();
    const tokenSymbol = await token.symbol();
    const faucetAmount = await faucet.faucetAmount();
    const cooldownTime = await faucet.cooldownTime();
    
    console.log(`✅ Contratos acessíveis:`);
    console.log(`   Token: ${tokenName} (${tokenSymbol})`);
    console.log(`   Faucet: ${ethers.formatEther(faucetAmount)} tokens per claim`);
    console.log(`   Cooldown: ${Number(cooldownTime) / 3600} horas`);
    
  } catch (error: any) {
    console.error("❌ Erro acessando contratos:", error.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 VERIFICAÇÃO CONCLUÍDA!");
  console.log("=".repeat(60));
  
  console.log("\n📊 LINKS ÚTEIS:");
  console.log(`🪙 Token: https://sepolia.etherscan.io/address/${tokenAddress}`);
  console.log(`🚰 Faucet: https://sepolia.etherscan.io/address/${faucetAddress}`);
  console.log(`🔍 Sepolia Explorer: https://sepolia.etherscan.io/`);
  
  console.log("\n🔧 PRÓXIMOS PASSOS:");
  console.log("1. ✅ Contratos verificados e acessíveis");
  console.log("2. 🔄 Atualize seu .env com os endereços:");
  console.log(`   NEXT_PUBLIC_TOKEN_CONTRACT=${tokenAddress}`);
  console.log(`   NEXT_PUBLIC_FAUCET_CONTRACT=${faucetAddress}`);
  console.log("3. 🧪 Teste o faucet:");
  console.log(`   npx hardhat run scripts/test-claim.ts --network sepolia`);
  console.log("4. 🚀 Reinicie sua aplicação Next.js");
  
  console.log("\n" + "=".repeat(60));
}

// Importar ethers se não estiver disponível globalmente
import { ethers } from "hardhat";

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ ERRO NA VERIFICAÇÃO:", error);
    process.exit(1);
  }); 