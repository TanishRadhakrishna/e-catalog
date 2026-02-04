module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx"],
  testMatch: [
    "<rootDir>/test/unit/**/*.test.jsx",
    "<rootDir>/test/integration/**/*.test.jsx",
    "<rootDir>/test/system/**/*.test.js"
  ],
  testPathIgnorePatterns: ["<rootDir>/test/e2e/"],
  transformIgnorePatterns: ["/node_modules/"],
};
