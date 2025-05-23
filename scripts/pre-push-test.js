const { spawnSync } = require('child_process');
const { existsSync } = require('fs');
const { join } = require('path');
const readline = require('readline');

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

// Verificar se os testes devem ser ignorados
const skipFlag = process.argv.includes('--skip-tests');
if (skipFlag) {
  console.log(`${colors.yellow}Skipping tests as requested with --skip-tests flag${colors.reset}`);
  process.exit(0);
}

// Verificar se a aplicação está rodando
function isAppRunning() {
  try {
    // Tenta conexão com a porta 3001
    const result = spawnSync('nc', ['-z', 'localhost', '3001']);
    return result.status === 0;
  } catch (error) {
    return false;
  }
}

// Quando executado como script principal
if (require.main === module) {
  console.log(`${colors.blue}Pre-push hook: Preparing to run e2e tests...${colors.reset}`);
  
  if (isAppRunning()) {
    console.log(`${colors.green}Application is already running on port 3001${colors.reset}`);
    console.log(`${colors.blue}Running tests only...${colors.reset}`);
    
    // Executar apenas os testes
    const testProcess = spawnSync('npm', ['run', 'test:e2e'], { 
      stdio: 'inherit',
      shell: true 
    });
    
    // Sair com o código de saída dos testes
    process.exit(testProcess.status);
  } else {
    console.log(`${colors.blue}Starting application and running tests...${colors.reset}`);
    
    // Executar o script que inicia a aplicação e os testes
    const fullProcess = spawnSync('node', ['scripts/run-tests.js'], {
      stdio: 'inherit',
      shell: true
    });
    
    // Sair com o código de saída do processo completo
    process.exit(fullProcess.status);
  }
} 