module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'func-names': 'off',
    'no-plusplus': 'off',
    'no-mixed-operators': 'off',
    'max-len': 'off',
    'no-param-reassign': 'off',
    'no-restricted-properties': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}