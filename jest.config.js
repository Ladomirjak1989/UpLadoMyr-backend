// module.exports = {
//   moduleFileExtensions: ['js', 'json', 'ts'],
//   rootDir: '.',
//   testRegex: '.*\\.spec\\.ts$',
//   transform: {
//     '^.+\\.(t|j)s$': 'ts-jest',
//   },
//   collectCoverageFrom: ['src/**/*.(t|j)s'],
//   coverageDirectory: '../coverage',
//   testEnvironment: 'node',
// };



// // jest.config.js  (CommonJS)
// const { pathsToModuleNameMapper } = require('ts-jest');
// const { compilerOptions } = require('./tsconfig.json');

// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',

//   rootDir: '.',
//   moduleFileExtensions: ['ts', 'js', 'json'],

//   transform: { '^.+\\.(t|j)s$': 'ts-jest' },

//   // ⬇️ важливо: ігноруємо зібраний код
//   testPathIgnorePatterns: ['/node_modules/', '/dist/'],

//   // ⬇️ покриття тільки по вихідних файлах
//   collectCoverageFrom: ['src/**/*.{ts,js}'],
//   coverageDirectory: './coverage',

//   // ⬇️ alias-и з tsconfig.json → для Jest
//   moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
//     prefix: '<rootDir>/', // робимо шляхи від кореня репо
//   }),

//   // (не обов'язково) прибрати “шумні” TS помилки всередині node_modules
//   globals: {
//     'ts-jest': {
//       diagnostics: {
//         ignoreCodes: [151001], // приклад: інколи корисно “приглушити”
//       },
//     },
//   },
// };


// // jest.config.js
// const ts = require('typescript');
// const { config: tsconfig } = ts.readConfigFile('./tsconfig.json', ts.sys.readFile);
// // тепер tsconfig.compilerOptions доступний без require()

// module.exports = {
//   // ...інші опції
//   moduleNameMapper: {
//     '^src/(.*)$': '<rootDir>/src/$1',
//   },
//   globals: {
//     'ts-jest': {
//       tsconfig: 'tsconfig.json',
//     },
//   },
// };




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

