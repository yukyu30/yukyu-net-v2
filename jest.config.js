const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transformIgnorePatterns: [
    'node_modules/(?!(remark|remark-parse|remark-html|mdast-util-from-markdown|mdast-util-to-string|micromark|unist-|unified|bail|is-plain-obj|trough|vfile|decode-named-character-reference|character-entities|mdast-util-to-hast|hast-util-to-html|hast-util-|comma-separated-tokens|property-information|space-separated-tokens|html-void-elements|zwitch|stringify-entities)/)',
  ],
}

module.exports = createJestConfig(customJestConfig)