const { spawn, exec } = require('child_process');
const { join } = require('path');
const readline = require('readline');

// Define colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(`${colors.blue}Starting the application and running tests...${colors.reset}`);

// Start the Next.js application
const app = spawn('npm', ['run', 'dev'], { 
  stdio: ['inherit', 'pipe', 'inherit'],
  shell: true 
});

let isAppReady = false;
let isTestsRunning = false;
let appPort = null;

// Create readline interface to read app output line by line
const rl = readline.createInterface({
  input: app.stdout,
  terminal: false
});

// Listen for app output
rl.on('line', (line) => {
  // Echo the app output
  console.log(`${colors.green}[App] ${line}${colors.reset}`);
  
  // Detect the port
  const portMatch = line.match(/Local:\s+http:\/\/localhost:(\d+)/);
  if (portMatch && portMatch[1]) {
    appPort = portMatch[1];
    console.log(`${colors.blue}Detected application running on port ${appPort}${colors.reset}`);
  }
  
  // Check if the app is ready
  if (line.includes('✓ Ready in')) {
    isAppReady = true;
    console.log(`${colors.blue}Application is ready. Starting tests...${colors.reset}`);
    
    // Wait a bit to ensure app is fully initialized
    setTimeout(() => {
      if (!isTestsRunning && appPort) {
        isTestsRunning = true;
        // Run Playwright tests with correct port
        const tests = spawn('npx', ['playwright', 'test', `--project-env=PORT=${appPort}`], { 
          stdio: 'inherit',
          shell: true,
          env: { ...process.env, APP_PORT: appPort }
        });
        
        tests.on('close', (code) => {
          console.log(`${colors.blue}Tests completed with exit code ${code}${colors.reset}`);
          console.log(`${colors.yellow}Shutting down application...${colors.reset}`);
          app.kill();
          process.exit(code);
        });
      }
    }, 2000);
  }
});

// Handle errors
app.on('error', (error) => {
  console.error(`${colors.red}Failed to start application: ${error}${colors.reset}`);
  process.exit(1);
});

// Handle app termination
app.on('close', (code) => {
  console.log(`${colors.yellow}Application process exited with code ${code}${colors.reset}`);
  if (!isTestsRunning) {
    process.exit(code);
  }
});

// Handle process termination signals
process.on('SIGINT', () => {
  console.log(`${colors.yellow}Received SIGINT. Shutting down...${colors.reset}`);
  app.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(`${colors.yellow}Received SIGTERM. Shutting down...${colors.reset}`);
  app.kill('SIGTERM');
  process.exit(0);
}); 