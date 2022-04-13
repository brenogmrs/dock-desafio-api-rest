export default {
    roots: ['<rootDir>/src'],
    collectCoverage: false,
    collectCoverageFrom: [
        '!<rootDir>/modules/**/{routes,controllers,repositories,usecases}/*.ts',
    ],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testEnvironment: 'node',
    transform: {
        '.+\\.ts$': 'ts-jest',
    },
};
