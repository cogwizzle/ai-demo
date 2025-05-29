import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    rules: {
      semi: ['error', 'never'],
      'prefer-const': 'error',
    },
  },
])
