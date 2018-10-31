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
    '^test/(.*)$': '<rootDir>/__tests__/unit/$1'
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
    '**/__tests__/unit/{modules,features}/**/*.ts'
  ],
  collectCoverageFrom: [
    '**/src/**/*.ts',
    '!**/src/typings/*.ts'
  ]
}
