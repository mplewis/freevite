// More info at https://redwoodjs.com/docs/project-configuration-dev-test-build

const config = {
  rootDir: '../',
  preset: '@redwoodjs/testing/config/jest/api',
  setupFiles: ['<rootDir>/jest.setup.js'],
  prettierPath: null,
}

module.exports = config
