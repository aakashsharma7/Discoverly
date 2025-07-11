module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.(ts|tsx|js|jsx)', '**/?(*.)+(spec|test).(ts|tsx|js|jsx)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}; 