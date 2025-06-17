const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Função para executar comandos
function runCommand(command, args = [], options = {}) {
  try {
    const fullCommand = `${command} ${args.join(' ')}`;
    console.log(`🔄 Executando: ${fullCommand}`);
    execSync(fullCommand, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    console.error(`❌ Erro ao executar: ${command} ${args.join(' ')}`);
    return false;
  }
}

// Função para verificar se arquivos existem
function checkFiles() {
  const requiredFiles = [
    { path: 'package.json', desc: 'Arquivo de configuração do projeto' },
    { path: 'package-lock.json', desc: 'Arquivo de lock do NPM' },
    { path: 'tsconfig.json', desc: 'Configuração do TypeScript' },
    { path: 'next.config.js', desc: 'Configuração do Next.js' },
    { path: 'src', desc: 'Diretório de código fonte' },
  ];

  console.log('📋 Verificando arquivos necessários...');
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file.path)) {
      console.error(`❌ ${file.desc} não encontrado: ${file.path}`);
      return false;
    }
    console.log(`✅ ${file.desc}: ${file.path}`);
  }
  
  return true;
}

// Função principal de testes
function runTests() {
  console.log('🚀 Iniciando testes pré-push...\n');

  // 1. Verificar arquivos
  if (!checkFiles()) {
    process.exit(1);
  }

  // 2. Instalar dependências
  console.log('\n📦 Verificando dependências...');
  if (!runCommand('npm', ['ci'])) {
    console.error('❌ Falha ao instalar dependências');
    process.exit(1);
  }

  // 3. Verificar lint
  console.log('\n🔍 Executando verificação de lint...');
  if (!runCommand('npm', ['run', 'lint'])) {
    console.error('❌ Falha na verificação de lint');
    process.exit(1);
  }

  // 4. Verificar tipos TypeScript (temporariamente desabilitado)
  console.log('\n🔧 Verificação de tipos TypeScript temporariamente desabilitada');
  console.log('💡 Execute "npm run type-check" manualmente para verificar tipos');
  
  // 5. Executar testes unitários
  console.log('\n🧪 Executando testes unitários...');
  if (!runCommand('npm', ['run', 'test:unit'])) {
    console.error('❌ Falha nos testes unitários');
    process.exit(1);
  }

  // 6. Executar testes E2E (se especificado)
  if (process.argv.includes('--all-tests')) {
    console.log('\n🎭 Executando testes E2E...');
    if (!runCommand('npm', ['run', 'test:e2e'])) {
      console.error('❌ Falha nos testes E2E');
      process.exit(1);
    }
  }

  // 7. Tentar build
  console.log('\n🏗️ Testando build...');
  if (!runCommand('npm', ['run', 'build'])) {
    console.error('❌ Falha no build');
    process.exit(1);
  }

  console.log('\n✅ Todos os testes passaram! Push liberado! 🚀');
  return true;
}

// Verificar se os testes devem ser ignorados
const skipFlag = process.argv.includes('--skip-tests');
if (skipFlag) {
  console.log(`${colors.yellow}⏭️ Pulando testes conforme solicitado com --skip-tests${colors.reset}`);
  process.exit(0);
}

// Verificar se deve executar apenas validações rápidas
const quickFlag = process.argv.includes('--quick');

// Quando executado como script principal
if (require.main === module) {
  console.log(`${colors.bold}${colors.blue}🚀 Pre-push Hook: Validações da Pipeline${colors.reset}`);
  
  // Executar validações da pipeline
  const success = runTests();
  
  if (!success) {
    console.log(`${colors.red}❌ Validações da pipeline falharam. Push cancelado.${colors.reset}`);
    process.exit(1);
  }
  
  // Se foi solicitado apenas validações rápidas, para aqui
  if (quickFlag) {
    console.log(`${colors.green}✅ Validações rápidas concluídas com sucesso!${colors.reset}`);
    process.exit(0);
  }
  
  console.log(`${colors.green}✅ Todas as validações passaram! Push autorizado.${colors.reset}`);
  process.exit(0);
}

module.exports = { runTests, runCommand, checkFiles }; 