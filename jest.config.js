module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '^@actions/github$': '<rootDir>/__mocks__/@actions/github.ts'
  },
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        module: 'CommonJS',
        moduleResolution: 'node',
        skipLibCheck: true
      }
    }]
  },
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['text-summary', 'html', 'lcovonly'],
  coverageDirectory: 'reports/coverage',
}