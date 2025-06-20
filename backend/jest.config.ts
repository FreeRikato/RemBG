module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFilesAfterEnv: ["./src/test-setup.ts"], // A file to run before tests
    testMatch: ["**/__tests__/**/*.test.ts"], // Where to find test files
    moduleNameMapper: {
        // Handle module aliases, if you have them
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    testTimeout: 30000, // Increase timeout for integration tests
};
