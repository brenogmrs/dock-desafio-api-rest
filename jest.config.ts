export default {
    roots: ['<rootDir>/src'],
    collectCoverage: false,
    collectCoverageFrom: ['!<rootDir>/src/modules/**/{repositories,useCases}/*.ts'],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testEnvironment: 'node',
    transform: {
        '.+\\.ts$': 'ts-jest',
    },
};
