/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  rootDir: '.',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testRegex: '.*\\.spec\\.ts$',

  // Трансформ лише для TS — цього достатньо
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },

  // Якщо в коді є імпорт типу `import 'src/...'`
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  // Коверадж за потреби
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
};

