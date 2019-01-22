module.exports = {
  "extends": [
    "airbnb-base",
  ],
  "rules": {
    "no-param-reassign": [2, { "props": false }],
    'class-methods-use-this': ['off'],
    'max-len': ['off'],
    'no-underscore-dangle': ['off'],
    'no-console': ['off'],
  },
  "env": {
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": 2017
  },
};
