module.exports = {
  root: true,
  extends: ['@redwoodjs/eslint-config'],
  plugins: ['jsdoc'],
  rules: {
    // max line length => 100
    'max-len': ['error', { code: 100, tabWidth: 2 }],
    'jsdoc/require-jsdoc': ['error', { publicOnly: true }],
    'no-restricted-imports': [
      'error',
      { name: 'dayjs', message: 'Please import from `dayjs.ts` instead' },
    ],
  },
  overrides: [
    {
      files: ['**/*SVG.tsx', '**/*.test.ts', '**/*.test.tsx'],
      rules: {
        'max-len': 'off',
      },
    },
    {
      files: ['api/src/lib/shared/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['*api.config*'],
                message:
                  'API config values are forbidden in library code shared with the web side',
              },
            ],
          },
        ],
      },
    },
  ],
}
