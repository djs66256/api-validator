// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 1,
    // allow async-await
    'generator-star-spacing': 1,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    "indent": [1, 2],
    "linebreak-style": [1, "unix"],
    "semi": [1, "always"],
    "no-spaced-func": 1,
    "space-before-function-paren": [1, "always"],
    "no-trailing-spaces": 0
  }
}
