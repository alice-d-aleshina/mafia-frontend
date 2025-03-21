const nextJest = require('next/jest')
 
/** @type {import('jest').Config} */
const createJestConfig = nextJest({
 
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config = {
  verbose: true,
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/pages/api/utils/api$': '<rootDir>/src/__mocks__/api.ts',
    '^@/pages/api/utils/supabaseClient$': '<rootDir>/src/__mocks__/supabaseClient.ts',
    '^@/contexts/RoomContext$': '<rootDir>/src/__mocks__/RoomContext.tsx',
    '^next/navigation$': '<rootDir>/src/__mocks__/next/navigation.ts'
  }
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config)