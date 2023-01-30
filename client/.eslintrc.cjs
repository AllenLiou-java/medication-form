/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // eslint-plugin-vue 規則
    // 元件取名多個單字
    'vue/multi-word-component-names': 'off',
    // 在元素內容之前後強制換行
    'vue/singleline-html-element-content-newline': 'off',
    // 多元元素強制換行
    'vue/multiline-html-element-content-newline': 'off',
    // 禁止使用 v-html 防止 xss 風險
    'vue/no-v-html': 'off',

    // enable additional rules
    quotes: ['error', 'single', { avoidEscape: true }],
    // 強制必須加分號
    semi: ['error', 'always'],
    // 檢查未使用變數，'vars': 'all' 檢查所有變數情況。'args': 'none' 不需檢查參數
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none'
      }
    ],
    // 箭頭函式前後皆須空白
    'arrow-spacing': [
      'error',
      {
        before: true,
        after: true
      }
    ],
    // 禁止帶有 new Object 運算符
    'no-new-object': 'error',
    // 禁止重複 key 值
    'no-dupe-keys': 'error',
    // 禁止多餘空格
    'no-multi-spaces': 'error',
    'no-undef': 'off',
    'block-spacing': ['error', 'never']
  }
};
