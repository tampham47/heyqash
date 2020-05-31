module.exports = {
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es6: true,
    jest: true,
  },
  globals: {
    process: 'readonly',
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {},
};
