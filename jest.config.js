module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./src/tests/setupTests.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    testTimeout: 20000
};