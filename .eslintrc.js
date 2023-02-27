module.exports = {
  root: true,
  extends: ['@redwoodjs/eslint-config'],
  plugins: ['jsdoc'],
  rules: {
    // max line length => 100
    'max-len': ['error', { code: 100, tabWidth: 2 }],
    'jsdoc/require-jsdoc': ['error', { publicOnly: true }],
  },
}
