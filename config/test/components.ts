import type { Config } from 'jest';

const config: Config = {
  preset: 'solid-jest/preset/browser',
  rootDir: '../..',
  setupFilesAfterEnv: ['<rootDir>/node_modules/@testing-library/jest-dom/extend-expect'],
  filter: '**/*.{test,spec}.tsx',
};

export default config;
