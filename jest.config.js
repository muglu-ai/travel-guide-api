Sure, here's the contents for the file: /travel-guide-api/travel-guide-api/jest.config.js

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  setupFiles: ['<rootDir>/src/config/env.js'],
};