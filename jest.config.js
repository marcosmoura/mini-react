module.exports = {
  preset: 'ts-jest',
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  moduleFileExtensions: [
    'ts',
    'js'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^test/(.*)$': '<rootDir>/__tests__/$1'
  },
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig: 'tsconfig.json'
    }
  },
  testMatch: [
    '**/__tests__/{modules}/**/*.ts'
  ]
}
