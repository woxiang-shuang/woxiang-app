module.exports = {
  'env': {
    'browser': true,
    'es2020': true,
    'react-native/react-native': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  'parser': 'babel-eslint',
  'plugins': [
    'react',
    'react-native',
    'react-hooks'
  ],
  'rules': {
    'semi': 'error',
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
    'quote-props': 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'space-before-blocks': 'error',
    'space-before-function-paren': 'off',
    'space-in-parens': 'error',
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': 'error',
    'indent': ['error', 2],
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',

    'comma-dangle': 'off',
    'padded-blocks': 'off',
    'arrow-body-style': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-inline-styles': 2,
    'react-native/no-color-literals': 2,
    'react-native/no-raw-text': 2,
    'react-native/no-single-element-style-arrays': 2,
    'react-native/no-unused-styles': 'off',
    'react-native/no-color-literals': 'off'
  }
};
