const config = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
    preset: "ts-jest",
    testEnvironment: "jest-environment-node",
    testMatch: [
        "**/__tests__/**/*.?([mc])[jt]s?(x)",
        "**/?(*.)+(spec|test).?([mc])[jt]s?(x)"
    ],
    transform: { "^.+\\.tsx?$": "ts-jest" },
    transformIgnorePatterns: [
        "\\\\node_modules\\\\",
        "\\.pnp\\.[^\\\\]+$"
    ],
};
export default config;
