module.exports = {
  setupFilesAfterEnv: [
    "jest-extended"
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!**/node_modules/**"
  ],
  "rootDir": "src",
  "preset": "ts-jest",
  testEnvironment: "node"
}
