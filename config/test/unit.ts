import type { Config } from 'jest';

const config: Config = {
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  rootDir: '../..',
  testRegex: 'packages/.*\\.(spec|test).(t|j)s$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/index.ts$',
    '/dist/',
    '/release/',
    '/coverage/',
    '/config/',
    'config.(t|j)s$',
  ],
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'node',
};

export default config;
