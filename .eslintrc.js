module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,    
  },
  rules: {
    "eqeqeq":"error",
    "quotes":["error","single"],
    "semi":["error","never"],
    "indent":["error",2],
    "linebreak-style":["error", "unix"]    
  },
};
