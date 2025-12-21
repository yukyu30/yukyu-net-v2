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
    'node_modules/(?!(remark|remark-parse|remark-html|remark-gfm|remark-breaks|remark-rehype|rehype|rehype-raw|rehype-stringify|mdast-util-from-markdown|mdast-util-to-string|mdast-util-gfm|mdast-util-newline-to-break|micromark|unist-util-visit|unist-util-visit-parents|unist-util-is|unist-|unified|bail|is-plain-obj|trough|vfile|decode-named-character-reference|character-entities|mdast-util-to-hast|hast-util-to-html|hast-util-|comma-separated-tokens|property-information|space-separated-tokens|html-void-elements|zwitch|stringify-entities|ccount|escape-string-regexp|markdown-table|longest-streak)/)',
  ],
}

module.exports = createJestConfig(customJestConfig)