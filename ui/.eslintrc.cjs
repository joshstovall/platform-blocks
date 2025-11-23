module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all'
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'react-native',
    'unused-imports'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // React rules
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/no-unescaped-entities': 'off',

    // React Native rules
    'react-native/no-raw-text': 'off',
    'react-native/no-unused-styles': 'off',
    'react-native/split-platform-components': 'off',
    'react-native/no-inline-styles': 'off',
    'react-native/no-color-literals': 'off',
  'react-native/sort-styles': 'off',

    // TypeScript rules
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-types': 'off',

    // Unused imports/variables rules
    'unused-imports/no-unused-imports': 'off',
    'unused-imports/no-unused-vars': [
      'off',
      {
        'vars': 'all',
        'varsIgnorePattern': '^_',
        'args': 'after-used',
        'argsIgnorePattern': '^_'
      }
    ],
    'no-unused-vars': 'off',

    // Code style rules
    'no-trailing-spaces': 'off',
    'no-trailing-comma': 'off',
    'comma-dangle': ['off', 'never'],
    'quotes': ['error', 'single', {
      'avoidEscape': true,
      'allowTemplateLiterals': true
    }],
    'jsx-quotes': ['error', 'prefer-double'],

    // Additional code quality rules
    'prefer-const': 'off',
    'eol-last': 'off',
    'semi': ['off', 'always'],
    'indent': ['off', 2, { 'SwitchCase': 1 }],
    'object-curly-spacing': ['off', 'always'],
    'array-bracket-spacing': ['off', 'never'],
    'key-spacing': ['off', { 'beforeColon': false, 'afterColon': true }],
    'comma-spacing': ['off', { 'before': false, 'after': true }],
    'no-multiple-empty-lines': ['off', { 'max': 1, 'maxEOF': 0 }],

    'no-var': 'off',
    'no-unused-vars': 'off',
    'no-prototype-builtins': 'off',
    'no-console': 'warn',
    'no-useless-escape': 'off',
    'no-console': 'off'
  },
  env: {
    'react-native/react-native': true
  },
};
