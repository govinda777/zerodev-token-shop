const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './'
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/tests/'],
  transformIgnorePatterns: [],
  transform: {
    "^.+\.(js|jsx|ts|tsx|mjs)$": "babel-jest"
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'mjs'],
  globals: {
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder,
  },
};

module.exports = createJestConfig(customJestConfig);