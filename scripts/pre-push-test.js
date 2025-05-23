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

// Verificar portas comuns do Next.js
function findRunningAppPort() {
  const portsToCheck = [3000, 3001, 3002];
  
  for (const port of portsToCheck) {
    try {
      // Tenta conexão com a porta
      const result = spawnSync('nc', ['-z', 'localhost', port.toString()]);
      if (result.status === 0) {
        console.log(`${colors.green}Detected application running on port ${port}${colors.reset}`);
        return port;
      }
    } catch (error) {
      // Ignora erros de verificação
    }
  }
  
  return null;
}

// Quando executado como script principal
if (require.main === module) {
  console.log(`${colors.blue}Pre-push hook: Preparing to run e2e tests...${colors.reset}`);
  
  const runningPort = findRunningAppPort();
  
  if (runningPort) {
    console.log(`${colors.green}Application is already running on port ${runningPort}${colors.reset}`);
    console.log(`${colors.blue}Running tests only...${colors.reset}`);
    
    // Executar apenas os testes, passando a porta detectada
    const testProcess = spawnSync('npx', ['playwright', 'test'], { 
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, APP_PORT: runningPort.toString() }
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