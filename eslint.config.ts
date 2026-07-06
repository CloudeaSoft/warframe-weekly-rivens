import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: false,
    ignores: [
      'coverage',
      'dist',
      'lib',
      '*.tsbuildinfo',
    ],
  },
  {
    files: [
      'src/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}',
    ],
    rules: {
      'curly': ['error', 'all'],
      'no-undef': 'off',
      'node/prefer-global/buffer': 'off',
      'node/prefer-global/process': 'off',
      'unused-imports/no-unused-imports': 'error',
    },
  },
  {
    files: [
      'test/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}',
    ],
    rules: {
      'antfu/no-top-level-await': 'off',
      'curly': ['error', 'all'],
      'no-undef': 'off',
      'test/consistent-test-it': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unused-imports/no-unused-imports': 'error',
    },
  },
)
