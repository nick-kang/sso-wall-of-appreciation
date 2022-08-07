module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },

  env: {
    es2021: true,
    'shared-node-browser': true,
  },
  settings: {
    react: {
      version: '18',
    },
  },
  extends: [
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  plugins: [
    'simple-import-sort',
    'jsx-a11y',
    '@typescript-eslint',
    'react',
    'react-hooks',
    'unused-imports',
  ],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': ['error'],
    '@typescript-eslint/explicit-function-return-type': 'error',
    'react/prop-types': 'off',

    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
}
