import nextJest from 'next/jest.js'

import type { Config } from 'jest'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/?(*.)+(test|spec).[tj]s?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  // Evita que Jest intente testear la build de Next:
  coveragePathIgnorePatterns: ['/node_modules/', '/.next/']
}

export default createJestConfig(config)
