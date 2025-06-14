import { 
  createKernelClientForUser,
  createKernelClientWithVerifyingPaymaster,
  createKernelClientWithERC20Paymaster,
  getPaymasterInfo,
  PAYMASTER_CONFIG,
  PaymasterType
} from '../src/utils/zerodev';
import { generatePrivateKey } from 'viem/accounts';

async function testPaymaster(type: PaymasterType, privateKey: string) {
  console.log(`\n🧪 Testando ${getPaymasterInfo(type).name}...`);
  
  try {
    let client;
    
    switch (type) {
      case 'verifying':
        client = await createKernelClientWithVerifyingPaymaster(privateKey);
        break;
      case 'erc20':
        client = await createKernelClientWithERC20Paymaster(privateKey);
        break;
      default:
        client = await createKernelClientForUser(privateKey, 'default');
        break;
    }

    const info = getPaymasterInfo(type);
    
    console.log(`✅ ${info.name} configurado com sucesso!`);
    console.log(`   📍 Endereço: ${info.address}`);
    console.log(`   📝 Descrição: ${info.description}`);
    console.log(`   👤 Account Address: ${client.accountAddress}`);
    
    return true;
  } catch (error) {
    console.log(`❌ Erro ao configurar ${getPaymasterInfo(type).name}:`);
    console.log(`   ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Testando configuração de Paymasters');
  console.log('=====================================');
  
  // Generate a test private key
  const testPrivateKey = generatePrivateKey();
  console.log(`🔑 Usando chave privada de teste: ${testPrivateKey.slice(0, 10)}...`);
  
  // Test paymaster configuration
  console.log('\n📋 Configuração dos Paymasters:');
  console.log(`   Verifying Paymaster: ${PAYMASTER_CONFIG.VERIFYING_PAYMASTER}`);
  console.log(`   ERC20 Paymaster: ${PAYMASTER_CONFIG.ERC20_PAYMASTER}`);
  console.log(`   Self-Funded RPC: ${PAYMASTER_CONFIG.SELF_FUNDED_RPC}`);
  
  // Test each paymaster type
  const paymasterTypes: PaymasterType[] = ['default', 'verifying', 'erc20'];
  const results: { [key in PaymasterType]: boolean } = {
    default: false,
    verifying: false,
    erc20: false
  };
  
  for (const type of paymasterTypes) {
    results[type] = await testPaymaster(type, testPrivateKey);
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n📊 Resumo dos Testes:');
  console.log('=====================');
  
  for (const [type, success] of Object.entries(results)) {
    const icon = success ? '✅' : '❌';
    const status = success ? 'PASSOU' : 'FALHOU';
    console.log(`${icon} ${getPaymasterInfo(type as PaymasterType).name}: ${status}`);
  }
  
  const successCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.values(results).length;
  
  console.log(`\n🎯 Resultado: ${successCount}/${totalCount} paymasters funcionando`);
  
  if (successCount === totalCount) {
    console.log('🎉 Todos os paymasters estão funcionando corretamente!');
    console.log('💡 Você pode usar qualquer um deles para evitar o erro de fundos.');
  } else {
    console.log('⚠️  Alguns paymasters não estão funcionando.');
    console.log('🔧 Verifique a configuração e tente novamente.');
  }
  
  // Instructions
  console.log('\n📖 Como usar:');
  console.log('=============');
  console.log('1. Acesse a página /wallet na aplicação');
  console.log('2. Clique na aba "Paymaster" 🚀');
  console.log('3. Selecione o paymaster desejado');
  console.log('4. As transações agora serão patrocinadas automaticamente!');
  
  process.exit(successCount === totalCount ? 0 : 1);
}

// Handle errors
main().catch((error) => {
  console.error('💥 Erro fatal no teste:', error);
  process.exit(1);
}); 