module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.spec.js'], // Adjust the pattern as needed
    reporters: [
        'default',
        ['jest-junit', {
            outputDirectory: './reports',
            outputName: 'junit-report.xml',
        }],
    ],
};